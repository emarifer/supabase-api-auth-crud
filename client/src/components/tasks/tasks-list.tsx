import type { Component } from "solid-js";
import { Show, For, onMount } from "solid-js";

import { useTasks } from "../../context/tasks-context";
import { TaskCard } from "./task-card";
import { Message } from "../ui";

export const TaskList: Component = () => {
  const [state, { getTasks }] = useTasks();

  onMount(getTasks);

  return (
    <Show
      when={state.tasks.length !== 0}
      fallback={
        <div class="flex gap-2 justify-center items-center mx-auto">
          <svg fill="currentColor" class="w-5" viewBox="0 0 16 16">
            <path
              d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 \
		10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"
            />
            <path
              d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 \
	        4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"
            />
          </svg>
          <h3 class="text-center text-base md:text-xl">
            No tasks yet, please add a new task
          </h3>
        </div>
      }
    >
      <ul class="flex flex-col gap-5 bg-zinc-800 p-4 w-4/5 md:w-[400px] mx-auto rounded-xl">
        <Show when={!!state.error}>
          <Message message={state.error} />
        </Show>

        <For each={state.tasks}>{(item) => <TaskCard task={item} />}</For>
      </ul>
    </Show>
  );
};
