"use client";

import { useState } from "react";

export default function ShareMessageCard({
  title,
  description,
  shortMessage,
}: {
  title: string;
  description: string;
  shortMessage: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortMessage);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
      <p className="text-sm uppercase tracking-[0.24em] text-black/45">
        For sharing
      </p>
      <h2 className="mt-4 text-xl font-medium tracking-tight">{title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
        {description}
      </p>

      <div className="mt-6 rounded-2xl bg-black/[0.03] p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-black/45">
              Short message
            </p>
            <p className="mt-2 text-sm leading-7 text-black/72">
              {shortMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-full border border-black/10 px-4 py-2 text-sm text-black/72 transition hover:bg-black/[0.04] hover:text-black"
          >
            {copied ? "Copied" : "Copy message"}
          </button>
        </div>
      </div>
    </div>
  );
}
