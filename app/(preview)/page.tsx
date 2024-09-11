"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { experimental_useObject } from "ai/react";
import { Code } from "@/components/code";
import { useWindowSize } from "react-use";
import { Overview } from "@/components/overview";
import { z } from "zod";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [source, setSource] = useState<string>("");

  const [isOverviewVisible, setIsOverviewVisible] = useState<boolean>(true);
  const { width } = useWindowSize();

  const { submit, isLoading, object } = experimental_useObject({
    api: "/api/chat",
    schema: z.unknown(),
    onFinish({ object }) {
      if (object != null) {
      }
    },
    onError: () => {
      toast.error("You've been rate limited, please try again later!");
    },
  });

  useEffect(() => {
    if (isLoading && width < 768) {
      setIsOverviewVisible(false);
    }
  }, [isLoading, width]);

  return (
    <div className="flex flex-row bg-white dark:bg-zinc-900 h-dvh">
      <div className="flex md:flex-row flex-col overflow-hidden w-dvw">
        <div className="w-100dvw md:w-[calc(50dvw)] flex flex-col justify-center items-center p-4">
          <form
            className="flex flex-col gap-4 md:gap-12 w-full md:max-w-[500px]"
            onSubmit={(event) => {
              event.preventDefault();

              const form = event.target as HTMLFormElement;

              const prompt = form.elements.namedItem(
                "prompt",
              ) as HTMLInputElement;

              const source = form.elements.namedItem(
                "source",
              ) as HTMLInputElement;

              if (prompt.value.trim() && source.value.trim()) {
                if (source.value.startsWith("https://en.wikipedia.org/wiki/")) {
                  submit({ prompt: prompt.value, source: source.value });
                } else {
                  toast.error("Please enter a valid Wikipedia URL!");
                }
              }
            }}
          >
            {isOverviewVisible && <Overview />}

            <div className="flex flex-col gap-2">
              <input
                name="source"
                className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-400"
                placeholder="https://en.wikipedia.org/wiki/<topic>"
                value={source}
                onChange={(event) => {
                  setSource(event.target.value);
                }}
                disabled={isLoading}
              />
              <input
                name="prompt"
                className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-400"
                placeholder="Describe your schema..."
                value={prompt}
                onChange={(event) => {
                  setPrompt(event.target.value);
                }}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="dark:bg-zinc-50 bg-zinc-800 text-zinc-50 hover:bg-zinc-900 dark:hover:bg-zinc-200 rounded-md dark:text-zinc-900 py-1.5 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-2 overflow-y-scroll overflow-x-scroll w-100dvw md:w-[calc(50dvw)] p-4 border-t md:border-l md:border-t-0 h-dvh dark:border-zinc-700 dark:text-zinc-300">
          {isLoading || object ? (
            <Code object={object} />
          ) : (
            <div className="text-sm text-zinc-500 h-dvh md:w-[calc(50dvw)] flex flex-row justify-center items-center">
              <div>Your structured output will appear here.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
