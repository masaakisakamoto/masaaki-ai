"use client";

import { useState, type FormEvent, type ReactNode } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  website: string; // honeypot
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  address: "",
  message: "",
  website: "",
};

export default function SportsRequestForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.website) {
      return;
    }

    if (form.message.trim().length < 10) {
      setError("ご要望・ご相談内容は10文字以上でご記入ください。");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setDone(false);

    const composedMessage = [
      "【ご要望・ご相談内容】",
      form.message.trim(),
      "",
      "【送信者情報】",
      `お名前: ${form.name.trim()}`,
      `メールアドレス: ${form.email.trim()}`,
      `電話番号: ${form.phone.trim()}`,
      `ご住所: ${form.address.trim()}`,
    ].join("\n");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sports-request",
          area: "sports-request",
          audience: "citizen",
          pageUrl: "/study/sports/request",
          name: form.name.trim(),
          email: form.email.trim(),
          message: composedMessage,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit request");
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
          深谷市スポーツ推進委員へのご要望・ご相談フォーム
        </h2>

        <p className="mt-6 text-base leading-8 text-black/68">
          深谷市のスポーツ推進に関するお気づきのことや、ご要望、ご相談などがありましたら、お寄せください。
          <br className="hidden md:block" />
          地域での活動をよりよくしていくための参考にさせていただきます。
        </p>

        <div className="mt-8 rounded-2xl bg-black/[0.03] p-5">
          <p className="text-sm leading-7 text-black/70">
            安心してやり取りできるよう、
            <span className="font-medium text-black">
              お名前・メールアドレス・電話番号・ご住所は正確にご入力ください。
            </span>
          </p>

          <p className="mt-4 text-sm leading-7 text-black/70">
            内容によっては、お返事までにお時間をいただく場合や、回答できない場合があります。
            また、次のような内容はご遠慮ください。
          </p>

          <ul className="mt-4 space-y-1 text-sm leading-7 text-black/70">
            <li>・特定の個人や団体への誹謗中傷</li>
            <li>・営業活動を目的とした内容</li>
            <li>・政治、宗教に関する内容</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Field label="お名前">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
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

        <Field label="ご住所">
          <input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            required
            autoComplete="street-address"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="ご要望・ご相談内容">
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            required
            minLength={10}
            rows={8}
            className="w-full rounded-[24px] border border-black/10 bg-white px-4 py-4 text-sm leading-7 outline-none transition focus:border-black/25"
            placeholder="ご要望、ご相談内容をご記入ください。"
          />
        </Field>
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
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
          ありがとうございます。内容を受け付けました。
          <br />
          確認のうえ、必要に応じてご連絡いたします。
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
