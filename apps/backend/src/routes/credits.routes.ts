import { Router } from "express";
import { CreditTransactionType, prisma } from "@ai/database";
import { grantCreditsSchema } from "@ai/shared";

export const creditsRouter = Router();

creditsRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      select: {
        id: true,
        creditsBalance: true,
        creditTransactions: {
          orderBy: { createdAt: "desc" },
          take: 50
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: { code: "USER_NOT_FOUND", message: "User does not exist." } });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

creditsRouter.post("/grant", async (req, res, next) => {
  try {
    const input = grantCreditsSchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: input.userId },
        data: {
          creditsBalance: {
            increment: input.amount
          }
        },
        select: {
          id: true,
          creditsBalance: true
        }
      });

      const transaction = await tx.creditTransaction.create({
        data: {
          userId: input.userId,
          type: CreditTransactionType.GRANT,
          amount: input.amount,
          balanceAfter: user.creditsBalance,
          description: input.reason
        }
      });

      return { user, transaction };
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});
