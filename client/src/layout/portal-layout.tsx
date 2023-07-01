import type { Component, JSXElement } from "solid-js";

import { A, Link } from "@solidjs/router";

import { useAuth } from "../context/auth-context";

import addTaskIcon from "../assets/icon/task-list-add.svg";
import profileIcon from "../assets/icon/person-square.svg";
import logoutIcon from "../assets/icon/box-arrow-right.svg";
import tasksIcon from "../assets/icon/list-task.svg";
import tasksManagerIcon from "../assets/icon/checklist.svg";

export const PortalLayout: Component<{ children: JSXElement }> = (props) => {
  const [state, { logout }] = useAuth();

  return (
    <>
      <header>
        <nav class="flex justify-center gap-20 md:gap-60 items-center py-4 bg-slate-800 fixed top-0 left-0 right-0 z-10">
          <Link href={state.isAuthenticated ? "/tasks" : "#"}>
            <p class="hidden text-xl font-black md:block">Tasks Manager</p>
            <img
              title="Tasks Manager"
              class="w-14 -translate-x-6 md:hidden"
              src={tasksManagerIcon}
              alt="Tasks Manager Icon"
            />
          </Link>

          <ul class="flex justify-center gap-6 md:gap-4">
            <li>
              <A
                end
                class="border-0 hover:text-slate-500"
                activeClass="border-b-2 border-sky-500"
                href="/tasks"
              >
                <span class="hidden md:inline">Tasks</span>
                <img
                  title="Tasks"
                  class="w-6 -mt-0.5 md:hidden"
                  src={tasksIcon}
                  alt="Tasks Icon"
                />
              </A>
            </li>
            <li>
              <A
                end
                class="border-0 hover:text-slate-500"
                activeClass="border-b-2 border-sky-500"
                href="/add-task"
              >
                <span class="hidden md:inline">Add Task</span>
                <img
                  title="Add Task"
                  class="w-7 -mt-1 md:hidden"
                  src={addTaskIcon}
                  alt="Add-Task Icon"
                />
              </A>
            </li>
            <li>
              <A
                end
                class="border-0 hover:text-slate-500"
                activeClass="border-b-2 border-sky-500"
                href="/profile"
              >
                <span class="hidden md:inline">Profile</span>
                <img
                  title="Profile"
                  class="w-5 md:hidden"
                  src={profileIcon}
                  alt="Profile Icon"
                />
              </A>
            </li>

            <li>
              <Link href="/" onclick={() => logout()}>
                <span class="hidden md:inline">Logout</span>
                <img
                  title="Logout"
                  class="w-6 -mt-0.5 md:hidden"
                  src={logoutIcon}
                  alt="Logout Icon"
                />
              </Link>
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
