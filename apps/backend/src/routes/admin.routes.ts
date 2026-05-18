import { Router } from "express";
import { prisma } from "@ai/database";

export const adminRouter = Router();

adminRouter.get("/metrics", async (_req, res, next) => {
  try {
    const [users, tasks, assets, payments] = await Promise.all([
      prisma.user.count(),
      prisma.generationTask.count(),
      prisma.imageAsset.count(),
      prisma.payment.count()
    ]);

    return res.json({
      users,
      tasks,
      assets,
      payments
    });
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        creditsBalance: true,
        createdAt: true
      }
    });

    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

adminRouter.get("/tasks", async (_req, res, next) => {
  try {
    const tasks = await prisma.generationTask.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    return res.json({ tasks });
  } catch (error) {
    return next(error);
  }
});
