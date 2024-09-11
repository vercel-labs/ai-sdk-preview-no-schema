import Link from "next/link";
import { ObjectIcon, VercelIcon } from "./icons";

export const Overview = () => {
  return (
    <div key="overview" className="w-full">
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
          <VercelIcon />
          <span>+</span>
          <ObjectIcon />
        </p>
        <p>
          The no-schema output mode of the streamObject function allows you to
          stream a JSON object without specifying a schema. This is useful when
          you may not know the structure of the object in advance.
        </p>
        <p>
          {" "}
          Learn more about the{" "}
          <Link
            className="text-blue-500 dark:text-blue-400"
            href="https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data#no-schema"
            target="_blank"
          >
            no-schema{" "}
          </Link>
          output mode from Vercel AI SDK.
        </p>
      </div>
    </div>
  );
};
