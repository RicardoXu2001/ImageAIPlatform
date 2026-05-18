import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  userId: z.string().uuid(),
  priceId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
