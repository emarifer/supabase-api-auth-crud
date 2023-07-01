import { Router } from "express";

const router = Router();

router.get("/healthchecker", (_req, res) => {
  return res.send(
    "Building an Full Stack App covering Auth flow & CRUD with Nodejs and Supabase and Frontend Solidjs with TypeScript"
  );
});

export default router;
