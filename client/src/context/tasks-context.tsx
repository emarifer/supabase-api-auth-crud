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
  readonly loading: boolean;
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
  loading: false,
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
  loading?: boolean;
}> = (props) => {
  const [state, setState] = createStore({
    tasks: props.tasks ?? defaultState.tasks,
    error: props.error ?? defaultState.error,
    loading: props.loading ?? defaultState.loading,
  });

  const createTask = (task: TaskCreateRequest) => {
    setState("loading", true);

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
          setState("loading", false);
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

          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);

          setState("loading", false);
        }
      });
  };

  const getTasks = () => {
    setState("loading", true);

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
          setState("loading", false);
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

          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);

          setState("loading", false);
        }
      });
  };

  const getTask = async (id: string) => {
    setState("loading", true);

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

          setState("loading", false);

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

          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);

          setState("loading", false);
        }
      });
  };

  const updateTask = (id: string, itemToUpadate: TaskUpdateRequest) => {
    setState("loading", true);

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
          setState("loading", false);
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

          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);

          setState("loading", false);
        }
      });
  };

  const deleteTask = (id: string) => {
    setState("loading", true);

    axios
      .delete(`/tasks/${id}`)
      .then((response) => {
        if (response.status == 204) {
          // console.log(response.status);
          setState(
            "tasks",
            state.tasks.filter((task) => task.id !== id)
          );

          setState("loading", false);
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

          setState("loading", false);
        } else {
          // console.error((err as Error).message);
          setState("error", (err as Error).message);

          setState("loading", false);
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
