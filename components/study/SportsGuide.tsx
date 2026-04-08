"use client";

import { useState } from "react";

export default function SportsGuide() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!input) return;

    setLoading(true);

    const res = await fetch("/api/sports-guide", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setReply(data.reply);
    setLoading(false);
  }

  return (
    <section className="mt-16">
      <div className="rounded-[28px] border border-black/8 bg-white p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <p className="text-sm uppercase tracking-[0.24em] text-black/45">
          AI Guide
        </p>
        <h2 className="mt-4 text-xl font-medium tracking-tight">
          このページについて質問する
        </h2>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "市民向けの内容は？",
            "学校ではどう活用できる？",
            "高齢者向けのポイントは？",
            "行政でどう使える？",
          ].map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/70 hover:bg-black/[0.04]"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例：市民向けの内容は？"
            className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm"
          />
          <button
            onClick={handleAsk}
            className="rounded-full border border-black/10 px-4 py-2 text-sm hover:bg-black/[0.04]"
          >
            聞いてみる
          </button>
        </div>

        {loading && (
          <p className="mt-4 text-sm text-black/50">Thinking...</p>
        )}

        {reply && (
          <div className="mt-6 rounded-2xl bg-black/[0.03] p-4 text-sm leading-7 text-black/80">
            {reply}
          </div>
        )}
      </div>
    </section>
  );
}
