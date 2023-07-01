import type { Component } from "solid-js";

import { PortalLayout } from "../layout";
import { TaskList } from "../components/tasks";
import { WelcomeComponent } from "../components/ui";

export const TasksPage: Component = () => {
  return (
    <PortalLayout>
      <WelcomeComponent />

      <hr class="w-4/5  md:w-[400px] mx-auto my-6 md:mt-12 md:mb-4" />

      <TaskList />
    </PortalLayout>
  );
};
