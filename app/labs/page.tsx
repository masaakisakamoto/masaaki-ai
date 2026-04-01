"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const copy = {
  en: {
    site: "MASAAKI AI",
    projects: "Projects",
    labs: "Labs",

    eyebrow: "Labs",
    title1: "Experimental systems,",
    title2: "long-term explorations.",
    body1: "Early systems, prototypes, and foundations",
    body2: "I’m building over time.",

    lab01: "Lab 01",
    lab01Title: "Motion Engine",
    lab01Body: "An AI foundation for making human movement visible.",
    lab01Link: "Visit motionengine.ai →",

    lab02: "Lab 02",
    lab02Title: "Fukaya Proposal Prototype",
    lab02Body:
      "A consultation prototype currently validating the minimum core experience. Designed as an early proposal for Fukaya City, with room to evolve into a more playful experience that communicates the city’s charm.",
    lab02Link: "View prototype →",

    toggleEn: "EN",
    toggleJa: "JA",
  },
  ja: {
    site: "MASAAKI AI",
    projects: "Projects",
    labs: "Labs",

    eyebrow: "Labs",
    title1: "Experimental systems,",
    title2: "long-term explorations.",
    body1: "Early systems, prototypes, and foundations",
    body2: "I’m building over time.",

    lab01: "Lab 01",
    lab01Title: "Motion Engine",
    lab01Body: "人の動きを見える化していくためのAI基盤です。",
    lab01Link: "motionengine.aiを見る →",

    lab02: "Lab 02",
    lab02Title: "深谷市 提案プロトタイプ",
    lab02Body:
      "これは相談用のプロトタイプです。現在は体験の核となる最小構成で検証しています。今後は、深谷市の魅力をより楽しく伝えられる体験へ発展させることを想定しています。",
    lab02Link: "プロトタイプを見る →",

    toggleEn: "EN",
    toggleJa: "JA",
  },
} as const;

export default function LabsPage() {
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

        <div className="flex items-center gap-6">
          <Link href="/projects" className="hover:text-black transition">
            {t.projects}
          </Link>

          <Link href={`/labs?lang=${lang}`} className="hover:text-black transition">
            {t.labs}
          </Link>

          <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
            <Link
              href="/labs?lang=en"
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                lang === "en"
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              {t.toggleEn}
            </Link>
            <Link
              href="/labs?lang=ja"
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
            {t.lab01}
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            {t.lab01Title}
          </h2>

          <p className="mt-5 text-gray-500 leading-relaxed">
            {t.lab01Body}
          </p>

          <a
            href="https://motionengine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-sm text-black hover:opacity-60"
          >
            {t.lab01Link}
          </a>
        </div>

        <div className="rounded-[28px] border border-gray-200 p-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition duration-300">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
            {t.lab02}
          </p>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight">
            {t.lab02Title}
          </h2>

          <p className="mt-5 text-gray-500 leading-relaxed">
            {t.lab02Body}
          </p>

          <a
            href="https://fukkachan-ai.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block text-sm text-black hover:opacity-60"
          >
            {t.lab02Link}
          </a>
        </div>
      </section>
    </main>
  );
}
