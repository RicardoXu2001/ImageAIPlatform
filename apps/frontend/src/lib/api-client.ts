import { createGenerationTaskSchema, type GenerationTaskDto } from "@ai/shared";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function createGenerationTask(input: unknown) {
  const payload = createGenerationTaskSchema.parse(input);
  const response = await fetch(`${apiBaseUrl}/api/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to create generation task.");
  }

  return (await response.json()) as { taskId: string; status: string; pollingUrl: string };
}

export async function getGenerationTask(taskId: string) {
  const response = await fetch(`${apiBaseUrl}/api/generations/${taskId}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to fetch generation task.");
  }

  return (await response.json()) as GenerationTaskDto;
}
