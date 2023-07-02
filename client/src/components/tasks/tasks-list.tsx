import type { Component } from "solid-js";
import { Show, For } from "solid-js";

import { useTasks } from "../../context/tasks-context";
import { TaskCard } from "./task-card";
import { Message } from "../ui";

export const TaskList: Component = () => {
  const [state] = useTasks();

  return (
    <Show
      when={state.tasks.length !== 0 && !state.loading}
      fallback={
        <>
          <Show when={state.loading}>
            <div class="flex gap-2 justify-center items-center mx-auto">
              <svg
                width="16"
                height="16"
                fill="currentColor"
                class="w-5"
                viewBox="0 0 16 16"
              >
                <path
                  d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 \
	          2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 \
	          0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 \
	          4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 \
	          12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 \
	          1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 \
	          1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 \
	          3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"
                />
              </svg>
              <h3 class="text-center text-base md:text-xl">Wait a bit…</h3>
            </div>
          </Show>

          <Show when={state.tasks.length === 0}>
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
          </Show>
        </>
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
