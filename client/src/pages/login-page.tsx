import type { Component } from "solid-js";
import { createEffect, Show } from "solid-js";

import { Link, useNavigate } from "@solidjs/router";

import { useFormHandler } from "solid-form-handler";
import { zodSchema } from "solid-form-handler/zod";
import { z } from "zod";

import { Message, TextInput } from "../components/ui";
import { UserLoginRequest } from "../types";
import { useAuth } from "../context/auth-context";
import { DefaultLayout } from "../layout";

import submitIcon from "../assets/icon/submit.svg";

const schema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(6, "The password must be at least 6 characters"),
});

export const LoginPage: Component = () => {
  const formHandler = useFormHandler(zodSchema(schema));
  const { formData } = formHandler;
  const [state, { singin }] = useAuth();
  const navigate = useNavigate();

  const submit = async (event: Event) => {
    event.preventDefault();

    try {
      await formHandler.validateForm();

      const user: UserLoginRequest = {
        email: formData().email.trim(),
        password: formData().password.trim(),
      };

      await singin(user);

      // console.log(state.user);

      formHandler.resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  createEffect(() => {
    if (state.isAuthenticated) navigate("/tasks");
  });

  return (
    <DefaultLayout>
      <Show
        when={state.loading}
        fallback={
          <>
            <h1 class="my-10 md:my-16 text-2xl md:text-4xl font-bold text-center">
              Sign In
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
                label="Email"
                name="email"
                formHandler={formHandler}
                class="w-full px-4 py-2 bg-zinc-700 appearance-none rounded-lg outline-none"
              />

              <TextInput
                type="password"
                label="Password"
                name="password"
                formHandler={formHandler}
                class="w-full px-4 py-2 bg-zinc-700 appearance-none rounded-lg outline-none"
              />

              <div>
                <button class="bg-sky-600 hover:bg-sky-400 px-4 py-2 rounded-md mt-4">
                  <span class="hidden md:inline">Submit</span>
                  <img
                    title="Submit"
                    class="w-6 md:hidden"
                    src={submitIcon}
                    alt="Submit Icon"
                  />
                </button>
              </div>
            </form>

            <p class="flex gap-x-2 justify-center text-amber-400 mt-6">
              Don't have an account?
              <Link href="/register" class="hover:text-sky-500">
                SignUp
              </Link>
            </p>
          </>
        }
      >
        {/* Spinner */}
        <div class="w-12 h-12 mx-auto rounded-full animate-spin border-8 border-solid border-purple-500 border-t-transparent"></div>
      </Show>
    </DefaultLayout>
  );
};

/*
 * COLECCIÓN DE SPINNERS CON TAILWINDCSS. VER:
 * https://codepen.io/egoistdeveloper/pen/KKyxZZN
 */
