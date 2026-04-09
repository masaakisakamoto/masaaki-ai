"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type FormState = {
  organizationName: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  target: string;
  fee: string;
  signupMethod: string;
  contact: string;
  description: string;
  capacity: string;
  belongings: string;
  relatedUrl: string;
  websiteHoneypot: string;
};

const initialState: FormState = {
  organizationName: "",
  eventTitle: "",
  eventDate: "",
  location: "",
  target: "",
  fee: "",
  signupMethod: "",
  contact: "",
  description: "",
  capacity: "",
  belongings: "",
  relatedUrl: "",
  websiteHoneypot: "",
};

export default function SportsEventRequestForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.websiteHoneypot) {
      return;
    }

    if (form.description.trim().length < 20) {
      setError("イベント説明は20文字以上でご記入ください。");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setDone(false);

    const composedMessage = [
      "【イベント掲載申請】",
      "",
      `主催団体名: ${form.organizationName.trim()}`,
      `イベント名: ${form.eventTitle.trim()}`,
      `開催日: ${form.eventDate.trim()}`,
      `開催場所: ${form.location.trim()}`,
      `対象: ${form.target.trim()}`,
      `参加費: ${form.fee.trim()}`,
      `申込方法: ${form.signupMethod.trim()}`,
      `問い合わせ先: ${form.contact.trim()}`,
      "",
      "【イベント説明】",
      form.description.trim(),
      "",
      `定員: ${form.capacity.trim() || "-"}`,
      `持ち物: ${form.belongings.trim() || "-"}`,
      `関連URL: ${form.relatedUrl.trim() || "-"}`,
    ].join("\n");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sports-event-request",
          area: "sports-event-request",
          audience: "organization",
          pageUrl: "/study/sports/events/request",
          name: form.organizationName.trim(),
          email: "",
          message: composedMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit event request");
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
      <div className="max-w-3xl">
        <h2 className="text-2xl font-medium tracking-tight">
          イベント掲載申請フォーム
        </h2>

        <p className="mt-6 text-base leading-8 text-black/68">
          登録済み団体のイベントを、地域の中でわかりやすく紹介していくための掲載申請フォームです。
          <br className="hidden md:block" />
          内容を確認のうえ、必要に応じて掲載可否をご案内します。
        </p>

        <div className="mt-8 rounded-2xl bg-black/[0.03] p-5">
          <p className="text-sm leading-7 text-black/70">
            掲載内容の確認のため、
            <span className="font-medium text-black">
              主催団体名・開催日・開催場所・問い合わせ先は正確にご入力ください。
            </span>
          </p>

          <p className="mt-4 text-sm leading-7 text-black/70">
            内容によっては掲載までにお時間をいただく場合があります。
            また、スポーツ活動と関係のない内容や、営業目的の内容はご遠慮ください。
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Field label="主催団体名">
          <input
            value={form.organizationName}
            onChange={(e) => update("organizationName", e.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="イベント名">
          <input
            value={form.eventTitle}
            onChange={(e) => update("eventTitle", e.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="開催日">
          <input
            value={form.eventDate}
            onChange={(e) => update("eventDate", e.target.value)}
            required
            type="date"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="開催場所">
          <input
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="対象">
          <input
            value={form.target}
            onChange={(e) => update("target", e.target.value)}
            required
            placeholder="例：小学生、親子、一般、高齢者"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="参加費">
          <input
            value={form.fee}
            onChange={(e) => update("fee", e.target.value)}
            required
            placeholder="例：無料 / 500円"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="申込方法">
          <input
            value={form.signupMethod}
            onChange={(e) => update("signupMethod", e.target.value)}
            required
            placeholder="例：メール / フォーム / 電話"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="問い合わせ先">
          <input
            value={form.contact}
            onChange={(e) => update("contact", e.target.value)}
            required
            placeholder="電話番号またはメールアドレス"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="イベント説明">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
            minLength={20}
            rows={8}
            className="w-full rounded-[24px] border border-black/10 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-black/25"
            placeholder="イベントの内容をご記入ください。"
          />
        </Field>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Field label="定員（任意）">
          <input
            value={form.capacity}
            onChange={(e) => update("capacity", e.target.value)}
            placeholder="例：20名"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="持ち物（任意）">
          <input
            value={form.belongings}
            onChange={(e) => update("belongings", e.target.value)}
            placeholder="例：飲み物、タオル、室内履き"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="関連URL（任意）">
          <input
            value={form.relatedUrl}
            onChange={(e) => update("relatedUrl", e.target.value)}
            type="url"
            placeholder="https://"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            value={form.websiteHoneypot}
            onChange={(e) => update("websiteHoneypot", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-7 text-black/56">
          内容を確認のうえ、必要に応じてご連絡いたします。
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "送信中..." : "送信する"}
        </button>
      </div>

      {done ? (
        <p className="mt-4 text-sm text-black/70">
          ありがとうございます。イベント掲載申請を受け付けました。
          <br />
          内容を確認のうえ、必要に応じてご連絡いたします。
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
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-black/65">{label}</span>
      {children}
    </label>
  );
}
