import { z } from "zod";

export const grantCreditsSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().positive(),
  reason: z.string().min(1).max(500)
});

export type GrantCreditsInput = z.infer<typeof grantCreditsSchema>;
