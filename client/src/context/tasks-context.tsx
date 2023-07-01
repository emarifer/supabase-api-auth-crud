import { isAxiosError } from "axios";

import {
  createContext,
  useContext,
  ParentComponent,
  createEffect,
  onCleanup,
} from "solid-js";
import { createStore } from "solid-js/store";

import { TaskCreateRequest, Task, TaskUpdateRequest } from "../types";
import axios from "../api/axios-config";

export type TasksContextState = {
  readonly tasks: Task[];
  readonly error: string;
};

export type TasksContextValue = [
  state: TasksContextState,
  actions: {
    createTask: ((task: TaskCreateRequest) => void) | (() => undefined);
    getTasks: (() => void) | (() => undefined);
    getTask: ((id: string) => Promise<void | Task>) | (() => undefined);
    updateTask:
      | ((id: string, itemToUpadate: TaskUpdateRequest) => void)
      | (() => undefined);
    deleteTask: ((id: string) => void) | (() => undefined);
  }
];

const defaultState = {
  tasks: [],
  error: "",
};

const TasksContext = createContext<TasksContextValue>([
  defaultState,
  {
    createTask: () => undefined,
    getTasks: () => undefined,
    getTask: () => undefined,
    updateTask: () => undefined,
    deleteTask: () => undefined,
  },
]);

export const TasksProvider: ParentComponent<{
  tasks?: Task[];
  error?: string;
}> = (props) => {
  const [state, setState] = createStore({
    tasks: props.tasks ?? defaultState.tasks,
    error: props.error ?? defaultState.error,
  });

  const createTask = (task: TaskCreateRequest) => {
    axios
      .post("/tasks", task)
      .then((response) => {
        if (response.status == 200) {
          const data: Task = {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            completed: response.data.completed,
            created_at: response.data.created_at,
          };
          setState("tasks", [data, ...state.tasks]);
          // console.log(state.tasks);
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data);
          setState(
            "error",
            err.response?.data.message ||
              err.response?.data.error ||
              defaultState.error
          );
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);
        }
      });
  };

  const getTasks = () => {
    axios
      .get("/tasks")
      .then((response) => {
        if (response.status == 200) {
          const data: Task[] = response.data.map((task: Task) => {
            const item: Task = {
              id: task.id,
              title: task.title,
              description: task.description,
              completed: task.completed,
              created_at: task.created_at,
            };
            return item;
          });
          setState("tasks", [...data]);
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data);
          setState(
            "error",
            err.response?.data.message ||
              err.response?.data.error ||
              defaultState.error
          );
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);
        }
      });
  };

  const getTask = async (id: string) => {
    return axios
      .get(`/tasks/${id}`)
      .then((response) => {
        if (response.status == 200) {
          const data: Task = {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            completed: response.data.completed,
            created_at: response.data.created_at,
          };

          return data;
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data);
          setState(
            "error",
            err.response?.data.message ||
              err.response?.data.error ||
              defaultState.error
          );
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);
        }
      });
  };

  const updateTask = (id: string, itemToUpadate: TaskUpdateRequest) => {
    axios
      .put(`/tasks/${id}`, itemToUpadate)
      .then((response) => {
        if (response.status == 200) {
          setState(
            "tasks",
            state.tasks.map((task) =>
              task.id !== id
                ? task
                : {
                    ...task,
                    title: itemToUpadate.title,
                    description: itemToUpadate.description,
                    completed: itemToUpadate.completed,
                  }
            )
          );
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data);
          setState(
            "error",
            err.response?.data.message ||
              err.response?.data.error ||
              defaultState.error
          );
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);
        }
      });
  };

  const deleteTask = (id: string) => {
    axios
      .delete(`/tasks/${id}`)
      .then((response) => {
        if (response.status == 204) {
          // console.log(response.status);
          setState(
            "tasks",
            state.tasks.filter((task) => task.id !== id)
          );
        }
      })
      .catch((err) => {
        if (isAxiosError<{ [k: string]: string }>(err)) {
          // console.error(err.response?.data);
          setState(
            "error",
            err.response?.data.message ||
              err.response?.data.error ||
              defaultState.error
          );
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);
        }
      });
  };

  createEffect(() => {
    if (!!state.error) {
      const timer = setTimeout(() => {
        setState("error", "");
      }, 5000);
      onCleanup(() => clearTimeout(timer));
    }
  });

  return (
    <TasksContext.Provider
      value={[
        state,
        {
          createTask,
          getTasks,
          getTask,
          updateTask,
          deleteTask,
        },
      ]}
    >
      {props.children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
