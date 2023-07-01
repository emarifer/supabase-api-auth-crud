import { Database } from "./supabase";

export type TaskType = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskCreateType = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdateType = Database["public"]["Tables"]["tasks"]["Update"];

export type UserType = Database["public"]["Tables"]["users"]["Row"];
export type UserCreateType = Database["public"]["Tables"]["users"]["Insert"];

export interface TaskWithUser extends Omit<TaskType, "user_id"> {
  user_id: UserType;
}
