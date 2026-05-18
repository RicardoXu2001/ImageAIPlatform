import { Worker } from "bullmq";
import {
  GENERATION_QUEUE_NAME,
  type GenerationJobPayload,
  generationJobNames
} from "@ai/shared";
import {
  CreditTransactionType,
  GenerationStatus,
  ImageAssetType,
  prisma
} from "@ai/database";
import { redisConnection } from "./config/env.js";
import { OpenAIImageService } from "./openai-image.service.js";
import { storeGeneratedImage } from "./storage.service.js";

type GenerationParams = {
  size?: string;
  quality?: string;
  outputFormat?: "png" | "jpeg" | "webp";
};

const openAIImageService = new OpenAIImageService();

const worker = new Worker<GenerationJobPayload>(
  GENERATION_QUEUE_NAME,
  async (job) => {
    if (job.name !== generationJobNames.generateImage) {
      throw new Error(`Unsupported job name: ${job.name}`);
    }

    await processGenerationTask(job.data.taskId);
  },
  {
    connection: redisConnection,
    concurrency: 2
  }
);

worker.on("completed", (job) => {
  console.log(`Generation job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Generation job failed: ${job?.id}`, error);
});

console.log(`Worker listening on queue "${GENERATION_QUEUE_NAME}"`);

async function processGenerationTask(taskId: string) {
  const task = await prisma.generationTask.findUnique({
    where: {
      id: taskId
    }
  });

  if (!task) {
    throw new Error(`Generation task not found: ${taskId}`);
  }

  if (
    task.status === GenerationStatus.SUCCEEDED ||
    task.status === GenerationStatus.CANCELLED ||
    task.status === GenerationStatus.BLOCKED
  ) {
    return;
  }

  const params = normalizeParams(task.params);

  await prisma.generationTask.update({
    where: {
      id: task.id
    },
    data: {
      status: GenerationStatus.PROCESSING,
      startedAt: task.startedAt ?? new Date(),
      errorCode: null,
      errorMessage: null
    }
  });

  try {
    const prompt = task.finalPrompt ?? task.prompt;
    const images = await openAIImageService.generateImages({
      model: task.model,
      prompt,
      count: task.count,
      size: params.size ?? "1024x1024",
      quality: params.quality ?? "auto",
      outputFormat: params.outputFormat ?? "png"
    });

    if (images.length === 0) {
      throw new Error("OpenAI returned no images.");
    }

    const storedImages = await Promise.all(
      images.map(async (image) => ({
        image,
        storedImage: await storeGeneratedImage({
          taskId: task.id,
          index: image.index,
          base64: image.base64,
          format: params.outputFormat ?? "png"
        })
      }))
    );

    await prisma.$transaction(async (tx) => {
      for (const { image, storedImage } of storedImages) {
        await tx.imageAsset.create({
          data: {
            userId: task.userId,
            generationTaskId: task.id,
            type: ImageAssetType.GENERATED,
            bucket: storedImage.bucket,
            objectKey: storedImage.objectKey,
            publicUrl: storedImage.publicUrl,
            mimeType: storedImage.mimeType,
            fileName: storedImage.fileName,
            sizeBytes: storedImage.sizeBytes,
            width: task.width,
            height: task.height,
            metadata: {
              provider: task.provider,
              model: task.model,
              revisedPrompt: image.revisedPrompt
            }
          }
        });
      }

      await tx.generationTask.update({
        where: {
          id: task.id
        },
        data: {
          status: GenerationStatus.SUCCEEDED,
          completedAt: new Date()
        }
      });
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown image generation error.";

    await prisma.$transaction(async (tx) => {
      const failedTask = await tx.generationTask.update({
        where: {
          id: task.id
        },
        data: {
          status: GenerationStatus.FAILED,
          errorCode: "OPENAI_IMAGE_GENERATION_FAILED",
          errorMessage: message,
          completedAt: new Date()
        }
      });

      if (failedTask.costCredits > 0) {
        const updatedUser = await tx.user.update({
          where: { id: task.userId },
          data: {
            creditsBalance: {
              increment: failedTask.costCredits
            }
          },
          select: {
            creditsBalance: true
          }
        });

        await tx.creditTransaction.create({
          data: {
            userId: task.userId,
            type: CreditTransactionType.REFUND,
            amount: failedTask.costCredits,
            balanceAfter: updatedUser.creditsBalance,
            relatedTaskId: task.id,
            description: "Refund for failed image generation"
          }
        });
      }
    });

    throw error;
  }
}

function normalizeParams(params: unknown): GenerationParams {
  if (!params || typeof params !== "object") {
    return {};
  }

  const value = params as Record<string, unknown>;

  return {
    size: typeof value.size === "string" ? value.size : undefined,
    quality: typeof value.quality === "string" ? value.quality : undefined,
    outputFormat: isOutputFormat(value.outputFormat) ? value.outputFormat : undefined
  };
}

function isOutputFormat(value: unknown): value is "png" | "jpeg" | "webp" {
  return value === "png" || value === "jpeg" || value === "webp";
}
