import type { Component } from "solid-js";
import { Show, onMount } from "solid-js";

import { Outlet } from "@solidjs/router";

import { useAuth } from "./context/auth-context";

import { LoginPage } from "./pages";

export const ProtectedRoute: Component = () => {
  const [state, { checkLogin }] = useAuth();

  onMount(checkLogin);

  return (
    <Show when={state.isAuthenticated} fallback={<LoginPage />}>
      <Outlet />
    </Show>
  );
};
