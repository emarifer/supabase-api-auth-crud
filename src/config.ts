import dotenv from "dotenv";

dotenv.config();

// Server/API settings
export const PORT = process.env.PORT || 8000;

export const ENVIRONMENT = process.env.NODE_ENV;

export const TOKEN_SECRET =
  process.env.TOKEN_SECRET || "my_ultra_secure_secret";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Supabase settings
export const SUPABASE_URL_PROJECT = process.env.SUPABASE_URL_PROJECT;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
