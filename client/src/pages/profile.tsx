import type { Component } from "solid-js";

import { useAuth } from "../context/auth-context";
import { PortalLayout } from "../layout";

export const Profile: Component = () => {
  const [state] = useAuth();
  return (
    <PortalLayout>
      <div class="w-4/5 mt-16 bg-zinc-800 px-10 py-4 md:px-16 md:py-8 rounded-xl max-w-screen-sm mx-auto">
        <h1 class="text-4xl font-bold text-center">Profile</h1>

        <hr class="mt-8 mb-4 md:mt-12 md:mb-8" />

        <ul class="list-disc">
          <li class="font-bold">
            Username:&nbsp;&nbsp;
            <span class="font-light">{state.user?.username}</span>
          </li>
          <li class="font-bold">
            Email:&nbsp;&nbsp;
            <span class="font-light"> {state.user?.email}</span>
          </li>
          <li class="font-bold">
            Id:&nbsp;&nbsp;
            <span class="font-light"> {state.user?.id}</span>
          </li>
        </ul>
      </div>
    </PortalLayout>
  );
};
