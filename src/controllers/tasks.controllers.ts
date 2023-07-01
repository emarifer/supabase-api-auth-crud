import { Request, Response } from "express";

import {
  TaskCreateType,
  TaskUpdateType,
  TaskWithUser,
} from "../types/collections";
import db from "../db/supabase-client";

type createTaskBody = {
  title: string;
  description: string;
};

type taskResponse = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
};

export const getTasks = async (req: Request, res: Response) => {
  const { id } = req.tokenData!;

  try {
    const { data: tasks, error } = await db
      .from("tasks")
      .select(`*, user_id(*)`)
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .returns<TaskWithUser>();

    if (error) throw new Error(error.message);

    res.json(tasks);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Failed to get tasks: ${err.message}` });
    }
  }
};

export const createTask = async (
  req: Request<unknown, unknown, createTaskBody>,
  res: Response
) => {
  const { title, description } = req.body;
  const { id } = req.tokenData!;
  try {
    // check if user exists
    const { data: userFound, error: errorCheck } = await db
      .from("users")
      .select("*")
      .limit(1)
      .eq("id", id);

    if (errorCheck) throw new Error(errorCheck.message);

    if (!userFound) {
      return res.status(404).json({ message: "The user no longer exists" });
    }

    // instantiating the TaskCreateType
    const newTask: TaskCreateType = {
      title,
      description,
      user_id: id,
    };

    // saving the task in the database
    const { data, error: errorTask } = await db
      .from("tasks")
      .insert(newTask)
      .select();

    if (errorTask) throw new Error(errorTask.message);

    if (data[0]) {
      const taskSaved: taskResponse = {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description,
        completed: data[0].completed!,
        created_at: data[0].created_at,
      };

      // responding a json from the backend with user created
      res.json(taskSaved);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Failed to create task: ${err.message}` });
    }
  }
};

export const getTask = async (
  req: Request<{ id: string }, unknown, unknown>,
  res: Response
) => {
  const { id: task_id } = req.params;
  // const { id: userId } = req.tokenData!;

  try {
    // we verify that the task exists in the database
    const { data: taskFound, error: errorCheck } = await db
      .from("tasks")
      .select("*")
      .eq("id", task_id);
    // .eq("user_id", user_id);

    if (errorCheck) throw new Error(errorCheck.message);

    if (!taskFound.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (taskFound[0]) {
      const retrievedTask: taskResponse = {
        id: taskFound[0].id,
        title: taskFound[0].title,
        description: taskFound[0].description,
        completed: taskFound[0].completed!,
        created_at: taskFound[0].created_at,
      };

      // responding a json from the backend with user created
      res.json(retrievedTask);
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Failed to get task: ${err.message}` });
    }
  }
};

export const updateTask = async (
  req: Request<{ id: string }, unknown, TaskUpdateType>,
  res: Response
) => {
  const { id: task_id } = req.params;
  // const { id: user_id } = req.tokenData!;

  try {
    // we verify that the task exists in the database
    const { data: taskFound, error: errorCheck } = await db
      .from("tasks")
      .select("*")
      .eq("id", task_id);
    // .eq("user_id", user_id);

    if (errorCheck) throw new Error(errorCheck.message);

    if (!taskFound.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, completed } = req.body;
    // We update only the fields that are not undefined
    if (title) taskFound[0].title = title;
    if (description) taskFound[0].description = description;
    taskFound[0].completed = completed!;

    // We save the updated object in the database
    const { data: updatedTask, error } = await db
      .from("tasks")
      .update(taskFound[0])
      .eq("id", task_id)
      // .eq("user_id", user_id)
      .select();

    if (error) throw new Error(error.message);

    if (!updatedTask.length) {
      return res.status(500).json({ error: "Failed to update task" });
    }

    res.json(updatedTask);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Failed to update task: ${err.message}` });
    }
  }
};

export const deleteTask = async (
  req: Request<{ id: string }, unknown, unknown>,
  res: Response
) => {
  const { id: task_id } = req.params;
  // const { id: userId } = req.tokenData!;

  try {
    // we verify that the task exists in the database
    const { data: taskFound, error: errorCheck } = await db
      .from("tasks")
      .select("*")
      .eq("id", task_id);
    // .eq("user_id", user_id);

    if (errorCheck) throw new Error(errorCheck.message);

    if (!taskFound.length) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { data: _, error } = await db
      .from("tasks")
      .delete()
      .eq("id", task_id);
    // .select();

    if (error) throw new Error(error.message);

    return res.sendStatus(204);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: `Failed to delete task: ${err.message}` });
    }
  }
};

/*
 * https://typeorm.io/many-to-one-one-to-many-relations
 * https://desarrolloweb.com/articulos/relacion-uno-a-muchos-typeorm-nest
 * https://desarrolloweb.com/articulos/metodo-find-repositorios-typeorm
 * https://orkhan.gitbook.io/typeorm/docs/find-options
 *
 * TIPADO DE Request.params. VER:
 * https://stackoverflow.com/questions/39348696/typescript-express-req-params#70696895
 *
 * RENOMBRAR OBJETOS AL DESESTRUCTURAR EN TYPESCRIPT. VER:
 * https://stackoverflow.com/questions/48318640/renaming-remaining-properties-variable-when-object-destructuring-in-typescript
 *
 * ACTUALIZAR ROW EN TYPEORM (primero se busca la fila por id y luego se guarda el objeto devuelto una vez que actualizamos los campos). VER:
 * https://stackoverflow.com/questions/49596061/typeorm-updating-entity-table
 *
 * COLUMNAS NULLABLES O NO REQUERIDAS EN TYPEORM. VER:
 * https://stackoverflow.com/questions/51131490/making-fields-columns-optional-required-using-typeorm
 * https://www.kulik.io/2023/01/30/optional-columns-in-typeorm/
 */
