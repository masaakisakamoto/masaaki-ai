"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
  shortMessage?: string;
};

export default function ShareMessageCard({
  title,
  description,
  shortMessage,
}: Props) {
  const [copied, setCopied] = useState(false);

  const textToCopy = shortMessage ?? description;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-8">
      <p className="text-sm uppercase tracking-[0.24em] text-black/45">
        Share
      </p>
      <h2 className="mt-4 text-2xl font-medium tracking-tight">{title}</h2>

      <div className="mt-4 space-y-4 text-sm leading-7 text-black/70">
        {description.split("\n\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/75 transition hover:bg-black/[0.04] hover:text-black"
        >
          {copied ? "コピーしました" : "メッセージをコピー"}
        </button>
      </div>
    </div>
  );
}
