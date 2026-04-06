"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const copy = {
  en: {
    site: "MASAAKI AI",

    eyebrow: "Service",
    title1: "Production services,",
    title2: "actively shipped.",
    body1: "Services built for real use,",
    body2: "with clarity, care, and long-term potential.",

    service01: "Service 01",
    service01Title: "Line Portrait",
    service01Body:
      "A simple AI portrait service that transforms a photo into a minimal line-based illustration.",
    service01Link: "Visit lineportrait.ai →",

    toggleEn: "EN",
    toggleJa: "JA",
  },
  ja: {
    site: "MASAAKI AI",

    eyebrow: "Service",
    title1: "Production services,",
    title2: "actively shipped.",
    body1: "実際の利用を前提に、",
    body2: "丁寧に育てているサービスです。",

    service01: "Service 01",
    service01Title: "Line Portrait",
    service01Body:
      "写真をミニマルなラインベースの似顔絵へ変換する、シンプルなAIポートレートサービスです。",
    service01Link: "lineportrait.aiを見る →",

    toggleEn: "EN",
    toggleJa: "JA",
  },
} as const;

export default function ServiceContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "ja" ? "ja" : "en";
  const t = copy[lang];

  return (
    <main className="min-h-screen bg-white text-black px-6 py-16">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <Link
          href="/"
          className="uppercase tracking-[0.2em] transition hover:text-black"
        >
          {t.site}
        </Link>

        <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
          <Link
            href="/service?lang=en"
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              lang === "en"
                ? "bg-black text-white"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            {t.toggleEn}
          </Link>
          <Link
            href="/service?lang=ja"
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              lang === "ja"
                ? "bg-black text-white"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            {t.toggleJa}
          </Link>
        </div>
      </div>

      <section className="mt-20 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
          {t.eyebrow}
        </p>

        <h1 className="mt-6 text-[52px] md:text-[72px] font-semibold leading-[1.05] tracking-tight">
          {t.title1}
          <br />
          {t.title2}
        </h1>

        <p className="mt-8 text-[17px] text-gray-500 max-w-xl leading-relaxed">
          {t.body1}
          <br />
          {t.body2}
        </p>
      </section>

      <section className="mt-20 grid md:grid-cols-2 gap-12 max-w-4xl">
        <div className="rounded-[28px] border border-gray-200 p-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition duration-300">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
            {t.service01}
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            {t.service01Title}
          </h2>

          <p className="mt-5 text-gray-500 leading-relaxed">
            {t.service01Body}
          </p>

          <a
            href="https://www.lineportrait.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-sm text-black hover:opacity-60"
          >
            {t.service01Link}
          </a>
        </div>
      </section>
    </main>
  );
}
