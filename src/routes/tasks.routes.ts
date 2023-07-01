import { Router } from "express";

import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/tasks.controllers";
import { auth } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/validator.middleware";
import { taskSchema } from "../schemas/task.schema";

const router = Router();

router.get("/tasks", auth, getTasks);
router.post("/tasks", auth, validateSchema(taskSchema), createTask);
router.get("/tasks/:id", auth, getTask);
router.put("/tasks/:id", auth, updateTask);
router.delete("/tasks/:id", auth, deleteTask);

export default router;
