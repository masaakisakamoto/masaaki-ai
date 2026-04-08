"use client";

import { useState } from "react";
import type { StructuredAnswer } from "@/lib/study/types";

type Props = {
  question: string;
  answer: StructuredAnswer;
};

export default function AnswerFeedback({ question, answer }: Props) {
  const [usefulness, setUsefulness] = useState<number | null>(null);
  const [audience, setAudience] = useState<string | null>(null);
  const [missing, setMissing] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!usefulness) return;

    setLoading(true);
    setError("");

    const message = JSON.stringify({
      question,
      answer,
      usefulness,
      bestAudience: audience,
      missing,
    });

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "structured-answer",
          area: "sports",
          audience: "auto",
          pageUrl: "/study/sports",
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setDone(true);
    } catch {
      setError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="mt-6 text-sm text-black/60">
        フィードバックありがとうございます。知識空間の改善に活かされます。
      </p>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-sm font-medium text-black/80">
        この回答は役に立ちましたか？
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {[3, 2, 1].map((v) => (
          <button
            key={v}
            onClick={() => setUsefulness(v)}
            className={`rounded-full border px-3 py-1 text-xs ${
              usefulness === v
                ? "bg-black text-white"
                : "border-black/10 text-black/70"
            }`}
          >
            {v === 3 ? "とても良い" : v === 2 ? "まあ良い" : "弱い"}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-black/70">一番役立った視点</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {["citizen", "school", "government"].map((v) => (
          <button
            key={v}
            onClick={() => setAudience(v)}
            className={`rounded-full border px-3 py-1 text-xs ${
              audience === v
                ? "bg-black text-white"
                : "border-black/10 text-black/70"
            }`}
          >
            {v === "citizen"
              ? "市民"
              : v === "school"
              ? "学校"
              : "行政"}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-black/70">足りなかったもの</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {["practice", "medical", "local"].map((v) => (
          <button
            key={v}
            onClick={() => setMissing(v)}
            className={`rounded-full border px-3 py-1 text-xs ${
              missing === v
                ? "bg-black text-white"
                : "border-black/10 text-black/70"
            }`}
          >
            {v === "practice"
              ? "実践"
              : v === "medical"
              ? "根拠"
              : "地域性"}
          </button>
        ))}
      </div>

      <button
        onClick={submit}
        disabled={!usefulness || loading}
        className="mt-5 rounded-full bg-black px-4 py-2 text-xs text-white disabled:opacity-40"
      >
        {loading ? "送信中..." : "送信"}
      </button>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
