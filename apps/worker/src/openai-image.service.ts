import OpenAI from "openai";
import { env } from "./config/env.js";

type GenerateImageOptions = {
  model: string;
  prompt: string;
  count: number;
  size: string;
  quality: string;
  outputFormat: "png" | "jpeg" | "webp";
};

export class OpenAIImageService {
  private readonly client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  async generateImages(options: GenerateImageOptions) {
    const response = await this.client.images.generate({
      model: options.model,
      prompt: options.prompt,
      n: options.count,
      size: options.size,
      quality: options.quality,
      output_format: options.outputFormat
    } as OpenAI.Images.ImageGenerateParams);

    const images = response.data ?? [];

    return images.map((image, index) => {
      if (!image.b64_json) {
        throw new Error(`OpenAI image response at index ${index} did not include b64_json.`);
      }

      return {
        index,
        base64: image.b64_json,
        revisedPrompt: image.revised_prompt
      };
    });
  }
}
