"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type FormState = {
  organizationName: string;
  representativeName: string;
  email: string;
  phone: string;
  region: string;
  summary: string;
  website: string;
  sns: string;
  websiteHoneypot: string;
};

const initialState: FormState = {
  organizationName: "",
  representativeName: "",
  email: "",
  phone: "",
  region: "",
  summary: "",
  website: "",
  sns: "",
  websiteHoneypot: "",
};

export default function SportsOrganizationRegisterForm() {
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

    if (form.summary.trim().length < 20) {
      setError("活動概要は20文字以上でご記入ください。");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setDone(false);

    const composedMessage = [
      "【団体登録申請】",
      "",
      `団体名: ${form.organizationName.trim()}`,
      `代表者名: ${form.representativeName.trim()}`,
      `メールアドレス: ${form.email.trim()}`,
      `電話番号: ${form.phone.trim()}`,
      `活動地域: ${form.region.trim()}`,
      "",
      "【活動概要】",
      form.summary.trim(),
      "",
      `Webサイト: ${form.website.trim() || "-"}`,
      `SNS: ${form.sns.trim() || "-"}`,
    ].join("\n");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sports-organization-register",
          area: "sports-organization-register",
          audience: "organization",
          pageUrl: "/study/sports/organizations/register",
          name: form.representativeName.trim(),
          email: form.email.trim(),
          message: composedMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit organization registration");
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
          イベント掲載を希望する団体の登録
        </h2>

        <p className="mt-6 text-base leading-8 text-black/68">
          地域のスポーツ活動を、安心してわかりやすく掲載できるように、
          まずは団体情報の登録をお願いしています。
          <br className="hidden md:block" />
          内容を確認のうえ、掲載申請のご案内につなげていきます。
        </p>

        <div className="mt-8 rounded-2xl bg-black/[0.03] p-5">
          <p className="text-sm leading-7 text-black/70">
            登録内容は確認やご連絡のために使用します。
            <span className="font-medium text-black">
              団体名・代表者名・メールアドレス・電話番号・活動地域は正確にご入力ください。
            </span>
          </p>

          <p className="mt-4 text-sm leading-7 text-black/70">
            内容によっては確認にお時間をいただく場合があります。
            また、スポーツ活動と関係のない内容や、営業目的の内容はご遠慮ください。
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Field label="団体名">
          <input
            value={form.organizationName}
            onChange={(e) => update("organizationName", e.target.value)}
            required
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="代表者名">
          <input
            value={form.representativeName}
            onChange={(e) => update("representativeName", e.target.value)}
            required
            autoComplete="name"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="メールアドレス">
          <input
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            type="email"
            autoComplete="email"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="電話番号">
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            required
            type="tel"
            autoComplete="tel"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="活動地域">
          <input
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            required
            placeholder="例：深谷市、岡部地区、花園地区 など"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>

        <Field label="Webサイト（任意）">
          <input
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            type="url"
            placeholder="https://"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="SNS（任意）">
          <input
            value={form.sns}
            onChange={(e) => update("sns", e.target.value)}
            placeholder="Instagram / X / Facebook など"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="活動概要">
          <textarea
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            required
            minLength={20}
            rows={8}
            className="w-full rounded-[24px] border border-black/10 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-black/25"
            placeholder="どのような活動をしている団体かをご記入ください。"
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
          ありがとうございます。団体登録申請を受け付けました。
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
