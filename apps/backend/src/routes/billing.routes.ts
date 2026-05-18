import { Router } from "express";
import Stripe from "stripe";
import { PaymentProvider, PaymentStatus, prisma } from "@ai/database";
import { createCheckoutSessionSchema } from "@ai/shared";
import { env } from "../config/env.js";

export const billingRouter = Router();

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

billingRouter.post("/checkout", async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error: {
          code: "STRIPE_NOT_CONFIGURED",
          message: "Stripe secret key is not configured."
        }
      });
    }

    const input = createCheckoutSessionSchema.parse(req.body);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: input.priceId, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: {
        userId: input.userId
      }
    });

    await prisma.payment.create({
      data: {
        userId: input.userId,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
        amount: 0,
        currency: "USD",
        providerSessionId: session.id,
        providerCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        planCode: input.priceId,
        productName: "Subscription"
      }
    });

    return res.json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    return next(error);
  }
});
