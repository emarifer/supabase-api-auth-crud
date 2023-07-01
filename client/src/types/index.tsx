export type UserRegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type UserLoginRequest = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
};

export type TaskCreateRequest = {
  title: string;
  description: string;
};

export type TaskUpdateRequest = {
  title: string;
  description: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
};
