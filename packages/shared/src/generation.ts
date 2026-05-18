import { z } from "zod";

export const imageSizeSchema = z.enum(["1024x1024", "1024x1536", "1536x1024"]);
export const imageQualitySchema = z.enum(["low", "medium", "high", "auto"]).default("auto");
export const imageFormatSchema = z.enum(["png", "jpeg", "webp"]).default("png");

export const createGenerationTaskSchema = z.object({
  userId: z.string().uuid().optional(),
  prompt: z.string().min(1).max(4000),
  negativePrompt: z.string().max(2000).optional(),
  model: z.string().min(1).default("gpt-image-1"),
  size: imageSizeSchema.default("1024x1024"),
  quality: imageQualitySchema,
  outputFormat: imageFormatSchema,
  count: z.number().int().min(1).max(4).default(1),
  metadata: z.record(z.unknown()).optional()
});

export type CreateGenerationTaskInput = z.infer<typeof createGenerationTaskSchema>;

export type GenerationJobPayload = {
  taskId: string;
};

export type GenerationStatusDto =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "BLOCKED";

export type GenerationTaskDto = {
  taskId: string;
  status: GenerationStatusDto;
  prompt: string;
  model: string;
  provider: string;
  assets: Array<{
    id: string;
    url: string | null;
    width: number | null;
    height: number | null;
    mimeType: string;
    createdAt: Date;
  }>;
};
