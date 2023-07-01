import { Express } from "express";

interface TokenData {
  id: string;
  iat: number;
  exp: number;
}
declare module "express" {
  interface Request {
    tokenData?: TokenData;
  }
}
