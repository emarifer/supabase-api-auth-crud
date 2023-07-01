import type { Component } from "solid-js";

import { useAuth } from "../../context/auth-context";

const capitalize = (name?: string) => {
  const username = name || "";

  return username.charAt(0).toUpperCase() + username.slice(1);
};

export const WelcomeComponent: Component = () => {
  const [state] = useAuth();

  return (
    <h1 class="w-5/6 md:w-full mt-8 md:mt-16 text-xl md:text-4xl font-bold text-center mx-auto md:tracking-wide">
      {`Welcome back to your Task List ${capitalize(state.user?.username)} !`}
    </h1>
  );
};
