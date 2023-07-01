import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import type { regSchema, logSchema } from "../schemas/auth.schema";
import type { tskSchema } from "../schemas/task.schema";

export const validateSchema =
  (schema: regSchema | logSchema | tskSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res
          .status(400)
          .json({ message: err.errors.map((error) => error.message) });
      }
    }
  };

/*
 * EXPORTAR (Y LUEGO IMPORTAR) SÓLO EL TIPO EN TYPESCRIPT. VER:
 * https://stackoverflow.com/questions/44079820/what-is-export-type-in-typescript#44079887
 */
