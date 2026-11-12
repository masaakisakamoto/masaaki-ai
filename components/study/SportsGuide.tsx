"use client";

import { useState } from "react";

import AnswerFeedback from "@/components/study/AnswerFeedback";
import StructuredAnswerView from "@/components/study/StructuredAnswerView";
import { SPORTS_GUIDE_PAUSED_MESSAGE } from "@/lib/study/guide-availability";
import type { StructuredAnswer } from "@/lib/study/types";

type Props = {
  /** false のときは、入力欄の代わりに一時停止の案内を出す */
  enabled?: boolean;
};

export default function SportsGuide({ enabled = true }: Props) {
  const [input, setInput] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [structured, setStructured] = useState<StructuredAnswer | null>(null);
  const [raw, setRaw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    const question = input.trim();
    if (!enabled || !question) return;

    setLoading(true);
    setStructured(null);
    setRaw("");
    setError("");
    setSubmittedQuestion("");

    try {
      const res = await fetch("/api/sports-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : `エラーが発生しました (${res.status})`
        );
        return;
      }

      setStructured(data.structured ?? null);
      setRaw(data.raw ?? "");
      setSubmittedQuestion(question);
    } catch {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16">
      <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-black/45">
          AI Guide
        </p>
        <h2 className="mt-4 text-xl font-medium tracking-tight">
          このページについて質問する
        </h2>

        {enabled ? (
          <>
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
                maxLength={500}
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
          </>
        ) : (
          <p className="mt-6 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm leading-7 text-black/70">
            {SPORTS_GUIDE_PAUSED_MESSAGE}
          </p>
        )}

        {loading ? (
          <p className="mt-4 text-sm text-black/50">
            構造化された回答を生成中です...
          </p>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-7 text-red-700">
            {error}
          </div>
        ) : null}

        {structured ? (
          <div className="mt-6">
            <StructuredAnswerView answer={structured} />
            <AnswerFeedback
              key={`${submittedQuestion}-${structured.title}`}
              question={submittedQuestion}
              answer={structured}
              area="sports"
            />
          </div>
        ) : null}

        {!structured && raw ? (
          <div className="mt-6 rounded-2xl bg-black/[0.03] p-4 text-sm leading-7 text-black/80">
            {raw}
          </div>
        ) : null}
      </div>
    </section>
  );
}
