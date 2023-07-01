import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import healthcheckerRoute from "./routes/healthchecker.routes";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";

import { PORT, FRONTEND_URL } from "./config";

// Initializations
export const app = express();

// Settings
app.set("port", PORT);

// Middelwares
app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(cookieParser());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api", healthcheckerRoute);
app.use("/api", authRoutes);
app.use("/api", tasksRoutes);

const serveStaticFile = async () => {
  if (process.env.NODE_ENV === "production") {
    const path = await import("path");
    app.use(express.static("client/dist"));

    app.get("*", (_req, res) => {
      // console.log(path.resolve("client", "dist", "index.html"));
      res.sendFile(path.resolve("client", "dist", "index.html"));
    });
  }
  // console.log(process.env.NODE_ENV);
};

serveStaticFile();

/*
 * SOBRE NODE_ENV. VER:
 * https://stackoverflow.com/questions/11104028/why-is-process-env-node-env-undefined
 *
 * https://www.youtube.com/watch?v=bwv2qu7M30s
 * https://github.com/batuhanbilginn/supabase-nextjs-typescript-starter/tree/main
 *
 * https://www.youtube.com/watch?v=roAJ61sTGIc
 * https://guillaumeduhan.hashnode.dev/relations-with-supabase
 *
 * https://supabase.com/docs/guides/api/rest/generating-types
 * https://supabase.com/docs/reference/cli/supabase-gen-types-typescript
 * https://supabase.com/docs/guides/cli
 * https://supabase.com/docs/guides/api/joins-and-nesting
 */
