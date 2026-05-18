import { Queue } from "bullmq";
import {
  GENERATION_QUEUE_NAME,
  type GenerationJobPayload,
  generationJobNames
} from "@ai/shared";
import { redisConnection } from "../config/env.js";

export const generationQueue = new Queue<GenerationJobPayload>(GENERATION_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000
    },
    removeOnComplete: {
      age: 60 * 60 * 24,
      count: 1000
    },
    removeOnFail: {
      age: 60 * 60 * 24 * 7
    }
  }
});

export async function enqueueGenerationTask(taskId: string) {
  return generationQueue.add(
    generationJobNames.generateImage,
    { taskId },
    {
      jobId: taskId
    }
  );
}
