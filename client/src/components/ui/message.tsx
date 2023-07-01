import type { Component } from "solid-js";

export const Message: Component<{ message: string }> = (props) => {
  return (
    <p class="bg-red-500 px-4 py-2 text-center text-sm rounded-lg -mb-2">
      {props.message}
    </p>
  );
};
