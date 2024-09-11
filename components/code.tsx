"use client";

import { GeistMono } from "geist/font/mono";

export const Code = ({ object }: { object: unknown }) => {
  return (
    <div className={`${GeistMono.className}`}>
      <pre className="text-sm text-zinc-600 dark:text-zinc-300 leading-6">
        {JSON.stringify(object, null, 2)}
      </pre>
    </div>
  );
};
