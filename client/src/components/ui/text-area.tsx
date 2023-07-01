import type { Component } from "solid-js";
import { JSX, Show, splitProps } from "solid-js";

import { FieldProps, Field } from "solid-form-handler";

export type TextAreaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldProps & { label?: string };

export const TextArea: Component<TextAreaProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "classList",
    "label",
    "rows",
    "formHandler",
  ]);

  return (
    <Field
      {...props}
      mode="input"
      render={(field) => (
        <div classList={local.classList}>
          <Show when={local.label}>
            <label
              class="block text-base font-medium mb-2 cursor-pointer"
              for={field.props.id}
            >
              {local.label}
            </label>
          </Show>

          <div class="relative">
            <Show when={field.helpers.error}>
              <svg
                class="w-5 text-red-500 absolute top-1/2 transform -translate-y-1/2 right-3"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
              </svg>
            </Show>

            <textarea
              rows={local.rows}
              {...rest}
              {...field.props}
              classList={{
                "focus:ring-4 ring-red-300 border-2 border-red-700":
                  field.helpers.error,
                "focus:ring-4 ring-blue-300 focus:border-2 focus:border-sky-700 border-2 border-zinc-500":
                  !field.helpers.error,
              }}
            />
          </div>

          <Show when={field.helpers.error}>
            <p class="text-sm text-red-500 mt-2">
              {field.helpers.errorMessage}
            </p>
          </Show>
        </div>
      )}
    />
  );
};
