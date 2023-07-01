import type { Component } from "solid-js";
import { Router, RouteDefinition, useRoutes } from "@solidjs/router";

import {
  HomePage,
  RegisterPage,
  LoginPage,
  TasksPage,
  TaskFormPage,
  Profile,
  NotFound,
} from "./pages";
import { AuthProvider } from "./context/auth-context";
import { TasksProvider } from "./context/tasks-context";
import { ProtectedRoute } from "./routes";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "login",
    component: LoginPage,
  },
  {
    path: "register",
    component: RegisterPage,
  },
  {
    path: "*",
    component: NotFound,
  },
  {
    path: "",
    component: ProtectedRoute,
    children: [
      {
        path: "tasks",
        component: TasksPage,
      },
      {
        path: "add-task",
        component: TaskFormPage,
      },
      {
        path: "tasks/:id",
        component: TaskFormPage,
      },
      {
        path: "profile",
        component: Profile,
      },
    ],
  },
];

const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <AuthProvider>
      <TasksProvider>
        <Router>
          <Routes />
        </Router>
      </TasksProvider>
    </AuthProvider>
  );
};

export default App;

/*
 * https://codesandbox.io/s/solid-app-router-protected-routes-qt5mv
 * https://www.thisdot.co/blog/how-to-authenticate-your-solidjs-routes-with-solid-router/
 *
 * CÓDIGO SIMILAR PARA UNA APLICACIÓN EN REACT. VER:
 * https://github.com/fazt/mern-crud-auth
 *
 * COLECCIÓN DE SPINNERS CON TAILWINDCSS. VER:
 * https://codepen.io/egoistdeveloper/pen/KKyxZZN
 */
