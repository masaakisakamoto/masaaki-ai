"use client";

import { useState } from "react";

type FormState = {
  type: string;
  area: string;
  audience: string;
  pageUrl: string;
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  type: "suggestion",
  area: "study",
  audience: "new",
  pageUrl: "",
  name: "",
  email: "",
  message: "",
};

export default function FeedbackForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setDone(false);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setDone(true);
      setForm(initialState);
    } catch {
      setError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 rounded-[32px] border border-black/8 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Type">
          <select
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          >
            <option value="suggestion">Suggestion</option>
            <option value="request">Request</option>
            <option value="correction">Correction</option>
            <option value="helpful">What helped</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <Field label="Area">
          <select
            value={form.area}
            onChange={(e) => update("area", e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          >
            <option value="study">Study top</option>
            <option value="human-systems">Human Systems</option>
            <option value="medical">Medical</option>
            <option value="ai">AI</option>
            <option value="sports">Sports</option>
            <option value="longevity">Longevity</option>
            <option value="tools">Tools</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <Field label="Audience">
          <select
            value={form.audience}
            onChange={(e) => update("audience", e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          >
            <option value="new">I’m new to this</option>
            <option value="familiar">I have some familiarity</option>
            <option value="professional">I work in this area</option>
          </select>
        </Field>

        <Field label="Page URL or topic">
          <input
            value={form.pageUrl}
            onChange={(e) => update("pageUrl", e.target.value)}
            placeholder="/study/sports"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="Email">
          <input
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            type="email"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="What would you like to share?">
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            required
            rows={8}
            className="w-full rounded-[24px] border border-black/10 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-black/25"
            placeholder="分かりづらかったこと、もっと知りたいこと、役に立ったことなど。"
          />
        </Field>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-7 text-black/56">
          Thank you. Your feedback becomes part of how this space evolves.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send feedback"}
        </button>
      </div>

      {done ? (
        <p className="mt-4 text-sm text-black/70">
          ありがとうございます。ご意見を受け取りました。
        </p>
      ) : null}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-black/65">{label}</span>
      {children}
    </label>
  );
}
