import { Router } from "express";
import { prisma } from "@ai/database";
import { loginSchema } from "@ai/shared";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.upsert({
      where: { email: input.email },
      update: { lastLoginAt: new Date() },
      create: {
        email: input.email,
        name: input.email.split("@")[0],
        lastLoginAt: new Date(),
        creditsBalance: 25
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        creditsBalance: true
      }
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});
