import type { Component } from "solid-js";
import { DefaultLayout } from "../layout";

export const HomePage: Component = () => {
  return (
    <DefaultLayout>
      <h1 class="w-5/6 md:w-full mt-8 md:mt-16 text-xl md:text-4xl font-bold text-center mx-auto md:tracking-wide">
        Home Page
      </h1>

      <hr class="w-4/5  md:w-[400px] mx-auto mt-4 mb-2 md:mt-12 md:mb-4" />
    </DefaultLayout>
  );
};
