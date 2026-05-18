import { Router } from "express";
import { CreditTransactionType, GenerationMode, GenerationStatus, prisma } from "@ai/database";
import { createGenerationTaskSchema } from "@ai/shared";
import { env } from "../config/env.js";
import { enqueueGenerationTask } from "../lib/generation-queue.js";

export const generationRouter = Router();

generationRouter.post("/", async (req, res, next) => {
  try {
    const input = createGenerationTaskSchema.parse({
      ...req.body,
      userId: req.body?.userId ?? req.header("x-user-id"),
      model: req.body?.model ?? env.OPENAI_IMAGE_MODEL
    });

    const userId = input.userId ?? (await getOrCreateDemoUserId());

    if (input.userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({
          error: {
            code: "USER_NOT_FOUND",
            message: "User does not exist."
          }
        });
      }
    }

    const [width, height] = input.size.split("x").map(Number);

    const costCredits = estimateGenerationCost(input.count, input.quality);

    const task = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { creditsBalance: true }
      });

      if (!user || user.creditsBalance < costCredits) {
        throw new InsufficientCreditsError();
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          creditsBalance: {
            decrement: costCredits
          }
        },
        select: {
          creditsBalance: true
        }
      });

      const createdTask = await tx.generationTask.create({
        data: {
          userId,
          mode: GenerationMode.TEXT_TO_IMAGE,
          status: GenerationStatus.QUEUED,
          provider: "openai",
          model: input.model,
          prompt: input.prompt,
          negativePrompt: input.negativePrompt,
          finalPrompt: input.prompt,
          width,
          height,
          count: input.count,
          costCredits,
          params: {
            size: input.size,
            quality: input.quality,
            outputFormat: input.outputFormat
          },
          metadata: input.metadata
        }
      });

      await tx.creditTransaction.create({
        data: {
          userId,
          type: CreditTransactionType.CONSUME,
          amount: -costCredits,
          balanceAfter: updatedUser.creditsBalance,
          relatedTaskId: createdTask.id,
          description: "AI image generation"
        }
      });

      await tx.promptHistory.create({
        data: {
          userId,
          generationTaskId: createdTask.id,
          rawPrompt: input.prompt,
          finalPrompt: input.prompt,
          negativePrompt: input.negativePrompt,
          provider: "openai",
          model: input.model,
          params: createdTask.params
        }
      });

      return createdTask;
    });

    await enqueueGenerationTask(task.id);

    return res.status(202).json({
      taskId: task.id,
      status: task.status,
      pollingUrl: `/api/generations/${task.id}`
    });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return res.status(402).json({
        error: {
          code: "INSUFFICIENT_CREDITS",
          message: "Not enough credits to create this generation task."
        }
      });
    }

    return next(error);
  }
});

generationRouter.get("/:taskId", async (req, res, next) => {
  try {
    const task = await prisma.generationTask.findUnique({
      where: {
        id: req.params.taskId
      },
      include: {
        outputAssets: {
          orderBy: {
            createdAt: "asc"
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        error: {
          code: "TASK_NOT_FOUND",
          message: "Generation task does not exist."
        }
      });
    }

    return res.json({
      taskId: task.id,
      status: task.status,
      prompt: task.prompt,
      model: task.model,
      provider: task.provider,
      params: task.params,
      error: task.errorMessage
        ? {
            code: task.errorCode,
            message: task.errorMessage
          }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      startedAt: task.startedAt,
      completedAt: task.completedAt,
      assets: task.outputAssets.map((asset) => ({
        id: asset.id,
        type: asset.type,
        url: asset.publicUrl,
        mimeType: asset.mimeType,
        width: asset.width,
        height: asset.height,
        sizeBytes: asset.sizeBytes?.toString() ?? null,
        createdAt: asset.createdAt
      }))
    });
  } catch (error) {
    return next(error);
  }
});

async function getOrCreateDemoUserId() {
  const user = await prisma.user.upsert({
    where: {
      email: env.DEMO_USER_EMAIL
    },
    update: {},
    create: {
      email: env.DEMO_USER_EMAIL,
      name: "Demo User"
    },
    select: {
      id: true
    }
  });

  return user.id;
}

function estimateGenerationCost(count: number, quality: string) {
  const qualityMultiplier = quality === "high" ? 4 : quality === "medium" ? 2 : 1;
  return count * 10 * qualityMultiplier;
}

class InsufficientCreditsError extends Error {}
