import path from "node:path";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { billingRouter } from "./routes/billing.routes.js";
import { creditsRouter } from "./routes/credits.routes.js";
import { generationRouter } from "./routes/generation.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/generated", express.static(path.resolve(env.LOCAL_STORAGE_DIR)));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/generations", generationRouter);
app.use("/api/auth", authRouter);
app.use("/api/credits", creditsRouter);
app.use("/api/billing", billingRouter);
app.use("/api/admin", adminRouter);

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request body.",
        issues: error.issues
      }
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected server error."
    }
  });
};

app.use(errorHandler);

app.listen(env.BACKEND_PORT, () => {
  console.log(`Backend API listening on http://localhost:${env.BACKEND_PORT}`);
});
