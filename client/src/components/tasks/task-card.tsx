import type { Component } from "solid-js";

import { Link } from "@solidjs/router";

import { Task } from "../../types";
import { convertDate } from "../../helpers";

export const TaskCard: Component<{ task: Task }> = (props) => {
  return (
    <li class="border border-gray-600 rounded px-6 py-3 hover:-translate-y-1.5 ease-in duration-300">
      <Link class="text-sm" href={`/tasks/${props.task.id}`}>
        <div class="flex justify-center items-start gap-2 md:gap-6">
          <span>{props.task.title}</span>
          <span
            class="w-1/2 text-slate-500 text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
            title={props.task.description}
          >
            {props.task.description}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500 text-xs font-semibold">
            {convertDate(props.task.created_at)}
          </span>

          <input
            type="checkbox"
            checked={props.task.completed}
            class="rounded w-5 h-5 bg-transparent border-gray-300 border-2 checked:accent-emerald-500"
            classList={{ "appearance-none": !props.task.completed }}
          />
        </div>
      </Link>
    </li>
  );
};
