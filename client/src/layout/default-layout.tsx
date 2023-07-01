import type { Component, JSXElement } from "solid-js";

import { A } from "@solidjs/router";

import tasksManagerIcon from "../assets/icon/checklist.svg";
import homeIcon from "../assets/icon/house-fill.svg";
import loginIcon from "../assets/icon/login-circle-fill.svg";
import signUpIcon from "../assets/icon/user-plus.svg";

export const DefaultLayout: Component<{ children: JSXElement }> = (props) => {
  return (
    <>
      <header>
        <nav class="flex justify-center gap-32 md:gap-80 items-center py-4 bg-slate-800 fixed top-0 left-0 right-0 z-10">
          <a href="/">
            <p class="hidden text-xl font-black md:block">Tasks Manager</p>
            <img
              title="Tasks Manager"
              class="w-14 -translate-x-6 md:hidden"
              src={tasksManagerIcon}
              alt="Tasks Manager Icon"
            />
          </a>

          <ul class="flex justify-center gap-4">
            <li>
              <A
                end
                class="border-0 hover:text-slate-500"
                activeClass="border-b-2 border-sky-500"
                href="/"
              >
                <span class="hidden md:inline">Home</span>
                <img
                  title="Home"
                  class="w-6 md:hidden"
                  src={homeIcon}
                  alt="Home Icon"
                />
              </A>
            </li>
            <li>
              <A
                end
                class="border-0 hover:text-slate-500"
                activeClass="border-b-2 border-sky-500"
                href="/login"
              >
                <span class="hidden md:inline">Login</span>
                <img
                  title="Login"
                  class="w-6 md:hidden"
                  src={loginIcon}
                  alt="Login Icon"
                />
              </A>
            </li>

            <li>
              <A
                end
                class="border-0 hover:text-slate-500"
                activeClass="border-b-2 border-sky-500"
                href="/register"
              >
                <span class="hidden md:inline">Sign Up</span>
                <img
                  title="Sign Up"
                  class="w-6 translate-y-0.5 md:hidden"
                  src={signUpIcon}
                  alt="SignUp Icon"
                />
              </A>
            </li>
          </ul>
        </nav>
      </header>

      <main class="mt-28 md:mt-36">{props.children}</main>

      <footer class="w-4/5 md:w-full mx-auto mt-12 mb-6 text-center">
        <a
          class="italic tracking-wider hover:text-sky-500 ease-in duration-300"
          href="https://github.com/emarifer?tab=repositories"
          target="_blank"
        >
          MIT Licensed | Copyright © {new Date().getFullYear()} Enrique Marín
        </a>
      </footer>
    </>
  );
};
