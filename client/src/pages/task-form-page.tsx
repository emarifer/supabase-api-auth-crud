import type { Component } from "solid-js";
import { Show, createSignal, onMount } from "solid-js";

import { useFormHandler } from "solid-form-handler";
import { zodSchema } from "solid-form-handler/zod";
import { z } from "zod";

import { useParams, useNavigate } from "@solidjs/router";

import { Message, TextArea, TextInput } from "../components/ui";
import { useTasks } from "../context/tasks-context";

import { PortalLayout } from "../layout";
import { TaskCreateRequest, TaskUpdateRequest } from "../types";

import saveIcon from "../assets/icon/save-2-fill.svg";
import goBackIcon from "../assets/icon/arrow-go-back-fill.svg";
import deleteIcon from "../assets/icon/trash3-fill.svg";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(255, "There are more than 255 characters"),
});

export const TaskFormPage: Component = () => {
  const formHandler = useFormHandler(zodSchema(schema));
  const { formData } = formHandler;
  const [state, { createTask, getTask, deleteTask, updateTask }] = useTasks();

  const [completed, setCompleted] = createSignal(false);

  const navigate = useNavigate();
  const params = useParams();

  onMount(async () => {
    if (params.id) {
      const selectedTask = await getTask(params.id);
      if (selectedTask) {
        setCompleted(selectedTask.completed);
        formHandler.fillForm({
          title: selectedTask.title,
          description: selectedTask.description,
        });
      }
    }
  });

  const submit = async (event: Event) => {
    event.preventDefault();

    try {
      await formHandler.validateForm();

      if (!params.id) {
        const task: TaskCreateRequest = {
          title: formData().title.trim(),
          description: formData().description.trim(),
        };

        createTask(task);
      } else {
        const task: TaskUpdateRequest = {
          title: formData().title.trim(),
          description: formData().description.trim(),
          completed: completed(),
        };

        updateTask(params.id, task);
      }

      // console.log(state.tasks);

      formHandler.resetForm();
      navigate("/tasks", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PortalLayout>
      <h1 class="my-10 md:my-16 text-2xl md:text-4xl font-bold text-center">
        Add/Edit Task
      </h1>

      <form
        class="flex flex-col gap-5 bg-zinc-800 p-4 w-4/5 md:w-[400px] mx-auto rounded-xl"
        autocomplete="off"
        onsubmit={submit}
      >
        <Show when={!!state.error}>
          <Message message={state.error} />
        </Show>

        <TextInput
          autofocus
          label="Title"
          name="title"
          formHandler={formHandler}
          class="w-full px-4 py-2 bg-zinc-700 appearance-none rounded-lg outline-none"
        />

        <TextArea
          label="Description"
          name="description"
          placeholder="maximum 255 characters"
          rows={3}
          formHandler={formHandler}
          class="w-full px-4 py-2 bg-zinc-700 appearance-none rounded-xl outline-none"
        />

        <Show when={params.id}>
          <input
            type="checkbox"
            checked={completed()}
            class="rounded w-5 h-5 bg-transparent border-gray-300 border-2 checked:accent-emerald-500"
            classList={{ "appearance-none": !completed() }}
            onchange={() => {
              setCompleted(!completed());
              // console.log(completed());
            }}
          />
        </Show>

        <div class="flex justify-between">
          <button
            type="submit"
            class="bg-sky-600 hover:bg-sky-400 px-4 py-2 rounded-md mt-4"
          >
            <span class="hidden md:inline">Save</span>
            <img
              title="Save"
              class="w-5 md:hidden"
              src={saveIcon}
              alt="Save Icon"
            />
          </button>

          <Show when={params.id}>
            <div class="flex justify-center gap-2">
              <button
                type="button"
                class="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-md mt-4"
                onclick={() => navigate("/tasks", { replace: true })}
              >
                <span class="hidden md:inline">&larr; Go back</span>
                <img
                  title="Go back"
                  class="w-5 md:hidden"
                  src={goBackIcon}
                  alt="Go Back Icon"
                />
              </button>
              <button
                type="button"
                class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md mt-4"
                onclick={() => {
                  deleteTask(params.id);
                  navigate("/tasks", { replace: true });
                }}
              >
                <span class="hidden md:inline">Delete</span>
                <img
                  title="Delete"
                  class="w-5 md:hidden"
                  src={deleteIcon}
                  alt="Delete Icon"
                />
              </button>
            </div>
          </Show>
        </div>
      </form>
    </PortalLayout>
  );
};
