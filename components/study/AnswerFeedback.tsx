"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { StructuredAnswer } from "@/lib/study/types";

type AudienceKey = "citizen" | "school" | "government";
type MissingKey = "practice" | "medical" | "local";
type Usefulness = 1 | 2 | 3;

type Props = {
  question: string;
  answer: StructuredAnswer;
  area?: string;
};

export default function AnswerFeedback({
  question,
  answer,
  area = "sports",
}: Props) {
  const pathname = usePathname();

  const [usefulness, setUsefulness] = useState<Usefulness | null>(null);
  const [bestAudience, setBestAudience] = useState<AudienceKey | null>(null);
  const [missing, setMissing] = useState<MissingKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!usefulness || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    const payload = {
      schemaVersion: 1,
      kind: "structured-answer-feedback",
      question,
      answer,
      usefulness,
      bestAudience,
      missing,
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "structured-answer",
          area,
          audience: bestAudience ?? "auto",
          pageUrl: pathname || `/study/${area}`,
          name: "",
          email: "",
          message: JSON.stringify(payload),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setDone(true);
    } catch {
      setError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
        <p className="text-sm leading-7 text-black/65">
          フィードバックありがとうございます。知識空間の改善に活かされます。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-sm font-medium text-black/80">
        この回答は役に立ちましたか？
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          { value: 3 as const, label: "とても良い" },
          { value: 2 as const, label: "まあ良い" },
          { value: 1 as const, label: "弱い" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setUsefulness(item.value)}
            className={`rounded-full border px-3 py-1 text-xs ${
              usefulness === item.value
                ? "bg-black text-white"
                : "border-black/10 text-black/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-black/70">一番役立った視点</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {[
          { value: "citizen" as const, label: "市民" },
          { value: "school" as const, label: "学校" },
          { value: "government" as const, label: "行政" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              setBestAudience((prev) =>
                prev === item.value ? null : item.value
              )
            }
            className={`rounded-full border px-3 py-1 text-xs ${
              bestAudience === item.value
                ? "bg-black text-white"
                : "border-black/10 text-black/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-black/70">足りなかったもの</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {[
          { value: "practice" as const, label: "実践" },
          { value: "medical" as const, label: "根拠" },
          { value: "local" as const, label: "地域性" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              setMissing((prev) => (prev === item.value ? null : item.value))
            }
            className={`rounded-full border px-3 py-1 text-xs ${
              missing === item.value
                ? "bg-black text-white"
                : "border-black/10 text-black/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!usefulness || isSubmitting}
        className="mt-5 rounded-full bg-black px-4 py-2 text-xs text-white disabled:opacity-40"
      >
        {isSubmitting ? "送信中..." : "送信"}
      </button>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
