"use client"

import Link from "next/link"
import React, { Fragment, useState } from "react"

type Locale = "en" | "ja"
type Localized = Record<Locale, string>
type ProjectMode = "protected" | "standard"

type Project = {
  slug: string
  type: Localized
  name: Localized
  oneLine: Localized
  evolution: Localized
  mode: ProjectMode
  status: Localized
  field?: Localized
  focus?: Localized
  stack?: Localized
  scope?: Localized
  system?: Localized
}

type Labels = {
  type: Localized
  field: Localized
  focus: Localized
  status: Localized
  stack: Localized
  scope: Localized
  system: Localized
  why: Localized
  insight: Localized
  approach: Localized
  evolution: Localized
  reflection: Localized
  context: Localized
  origin: Localized
}

type DetailCopy = {
  aiWhy1: Localized
  aiWhy2: Localized
  aiInsight1: Localized
  aiInsight2: Localized
  aiApproach1: Localized
  aiApproach2: Localized
  aiApproach3: Localized
  aiEvolution1: Localized
  aiEvolution2: Localized
  aiEvolution3: Localized
  aiReflection: Localized
  clientWhy: Localized
  clientReflection: Localized
  mimamoriContext: Localized
  mimamoriReflection: Localized
  oceanOrigin: Localized
  oceanReflection: Localized
}

type Copy = {
  pageTitle: Localized
  pageSubtitle: Localized
  otherProjects: Localized
  viewProject: Localized
  backToProjects: Localized
  footerList: Localized
  footerDetail: Localized
  additionalProjects: Localized
  labels: Labels
  detail: DetailCopy
}

const copy: Copy = {
  pageTitle: {
    en: "Projects",
    ja: "プロジェクト",
  },
  pageSubtitle: {
    en: "Still early — steadily building.",
    ja: "まだ始まったばかり。でも着実に積み上げている",
  },
  otherProjects: {
    en: "Other Projects",
    ja: "Other Projects / 他のプロジェクト",
  },
  viewProject: {
    en: "View project →",
    ja: "詳細を見る →",
  },
  backToProjects: {
    en: "← Back to Projects",
    ja: "← プロジェクト一覧へ",
  },
  footerList: {
    en: "Not just a system.",
    ja: "ただのシステムではない。",
  },
  footerDetail: {
    en: "Not just a system. Becoming.",
    ja: "ただのシステムではない。生成の途中にある。",
  },
  additionalProjects: {
    en: "Additional projects will be added over time.",
    ja: "並行して進行中のプロジェクトも、随時追加していきます。",
  },
  labels: {
    type: { en: "Type", ja: "種類" },
    field: { en: "Field", ja: "領域" },
    focus: { en: "Focus", ja: "焦点" },
    status: { en: "Status", ja: "状態" },
    stack: { en: "Stack", ja: "技術" },
    scope: { en: "Scope", ja: "規模" },
    system: { en: "System", ja: "構成" },
    why: { en: "Why", ja: "なぜ" },
    insight: { en: "Insight", ja: "洞察" },
    approach: { en: "Approach", ja: "アプローチ" },
    evolution: { en: "Evolution", ja: "変化" },
    reflection: { en: "Reflection", ja: "補足" },
    context: { en: "Context", ja: "背景" },
    origin: { en: "Origin", ja: "起点" },
  },
  detail: {
    aiWhy1: {
      en: "Tools do not scale trust.",
      ja: "信頼は、ツールだけでは広がらない。",
    },
    aiWhy2: {
      en: "Systems do.",
      ja: "それを広げるのは、システム。",
    },
    aiInsight1: {
      en: "AI does not replace humans.",
      ja: "AIは、人を置き換えるものではない。",
    },
    aiInsight2: {
      en: "It reveals structure.",
      ja: "人と組織の構造を、あらわにするものだ。",
    },
    aiApproach1: {
      en: "Not just features.",
      ja: "機能を足すだけではない。",
    },
    aiApproach2: {
      en: "Not just outputs.",
      ja: "出力を増やすだけでもない。",
    },
    aiApproach3: {
      en: "Designing for continuity, feedback, and evolution.",
      ja: "継続、フィードバック、進化が循環する前提で設計している。",
    },
    aiEvolution1: {
      en: "From idea",
      ja: "アイデアから、",
    },
    aiEvolution2: {
      en: "to operating layer",
      ja: "運用の層へ。",
    },
    aiEvolution3: {
      en: "still evolving",
      ja: "いまも進化の途中。",
    },
    aiReflection: {
      en: "Not every system should be explained in public. Some of the most important structure stays invisible.",
      ja: "すべてのシステムを公に説明すべきだとは思っていない。いちばん重要な構造ほど、見えない場所にある。",
    },
    clientWhy: {
      en: "Presence is fragile. The interface should support it without dominating it.",
      ja: "集中や没入は繊細だからこそ、UIは主張しすぎず、そっと支えるべきだと考えている。",
    },
    clientReflection: {
      en: "The UI is based on a provided design, with minimal adjustments for platform guidelines and usability and to improve review readiness.",
      ja: "UIは指定されたデザインをベースに、iOS / Android 最適化の過程で、審査対応や使いやすさのために最小限の調整のみを行っています。",
    },
    mimamoriContext: {
      en: "Early signals matter. Most systems react after breakdown, not before it.",
      ja: "不調の前には、かならず小さな兆しがある。多くの仕組みは、崩れた後にしか反応できていない。",
    },
    mimamoriReflection: {
      en: "A personal project can still aim at socially meaningful problems.",
      ja: "個人で進める開発でも、社会的に意味のある課題に向き合えると考えている。",
    },
    oceanOrigin: {
      en: "Started in a hackathon. Now evolving beyond the first prototype.",
      ja: "ハッカソンから始まり、いまは最初の試作を超えて育てている。",
    },
    oceanReflection: {
      en: "AI becomes more valuable when it helps surface tacit knowledge that would otherwise disappear.",
      ja: "AIの価値は、失われていく暗黙知を表に引き上げるとき、より大きくなる。",
    },
  },
}

const projects: Project[] = [
  {
    slug: "ai-company-os",
    name: {
      en: "AI Company OS",
      ja: "AI Company OS",
    },
    oneLine: {
      en: "A system where trust scales human potential.",
      ja: "信頼が人の可能性を広げていくためのシステム。",
    },
    evolution: {
      en: "→ evolving",
      ja: "→ 進化中",
    },
    type: {
      en: "SYSTEM",
      ja: "SYSTEM",
    },
    mode: "protected",
    field: {
      en: "Human × AI systems",
      ja: "Human × AI システム",
    },
    focus: {
      en: "Operating principles for collaboration",
      ja: "協働を支える運用原則の設計",
    },
    status: {
      en: "Private",
      ja: "非公開で設計中",
    },
  },
  {
    slug: "ocean-copilot",
    name: {
      en: "Ocean Copilot",
      ja: "Ocean Copilot",
    },
    oneLine: {
      en: "Capturing tacit knowledge in fisheries through AI.",
      ja: "漁業の暗黙知を、AIで受け継ぎやすい形にする試み。",
    },
    evolution: {
      en: "→ expanding",
      ja: "→ 拡張中",
    },
    type: {
      en: "WEB APP",
      ja: "WEB APP",
    },
    mode: "standard",
    stack: {
      en: "Next.js / AI / Data / Cloud",
      ja: "Next.js / AI / Data / Cloud",
    },
    scope: {
      en: "Knowledge capture and structuring system",
      ja: "知識の収集と構造化を行うWebアプリ",
    },
    system: {
      en: "Human input → AI structuring → insight output",
      ja: "人の入力 → AIで構造化 → 気づきとして出力",
    },
    status: {
      en: "Independent",
      ja: "個人で継続開発中",
    },
  },
  {
    slug: "private-client-app",
    name: {
      en: "[ Private Client App ]",
      ja: "[ 非公開クライアントアプリ ]",
    },
    oneLine: {
      en: "A cross-platform meditation system for presence.",
      ja: "“今ここ”の感覚を支える、クロスプラットフォームの瞑想アプリ。",
    },
    evolution: {
      en: "→ refining",
      ja: "→ 仕上げ中",
    },
    type: {
      en: "iOS / ANDROID",
      ja: "iOS / ANDROID",
    },
    mode: "standard",
    stack: {
      en: "React Native / Expo / TypeScript / Audio / Timer",
      ja: "React Native / Expo / TypeScript / Audio / Timer",
    },
    scope: {
      en: "Cross-platform mobile app for a client release",
      ja: "クライアント向けに開発しているクロスプラットフォームアプリ",
    },
    system: {
      en: "UI layer → session state → audio flow → platform delivery",
      ja: "UI層 → セッション状態 → 音声フロー → 各OSへの提供",
    },
    status: {
      en: "Client work / releasing soon",
      ja: "クライアント案件 / 近日リリース予定",
    },
  },
  {
    slug: "mimamori",
    name: {
      en: "Mimamori (independent project)",
      ja: "Mimamori（個人開発）",
    },
    oneLine: {
      en: "Signals before breakdown.",
      ja: "不調が表面化する前の、小さなサインを捉える。",
    },
    evolution: {
      en: "→ testing",
      ja: "→ 検証中",
    },
    type: {
      en: "iOS / WATCH",
      ja: "iOS / WATCH",
    },
    mode: "standard",
    stack: {
      en: "Apple Watch / iPhone / Health / Cloud",
      ja: "Apple Watch / iPhone / Health / Cloud",
    },
    scope: {
      en: "Signal monitoring with early detection",
      ja: "早期検知を目指したシグナル監視システム",
    },
    system: {
      en: "Watch → phone → cloud → feedback",
      ja: "Watch → phone → cloud → feedback",
    },
    status: {
      en: "Independent",
      ja: "個人で継続開発中",
    },
  },
]

function LocaleToggle({
  locale,
  onChange,
}: {
  locale: Locale
  onChange: (locale: Locale) => void
}) {
  return (
    <div className="inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm">
      <button
        onClick={() => onChange("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          locale === "en"
            ? "bg-black text-white"
            : "text-neutral-500 hover:text-black"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onChange("ja")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
          locale === "ja"
            ? "bg-black text-white"
            : "text-neutral-500 hover:text-black"
        }`}
      >
        JA
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">{title}</p>
      <div className="mt-5 max-w-2xl text-base leading-8 text-neutral-300">{children}</div>
    </section>
  )
}

function MultiLineSection({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">{title}</p>
      <div className="mt-5 space-y-4 max-w-2xl text-base leading-8 text-neutral-300">
        {lines.map((line, index) => (
          <p key={`${title}-${index}`}>{line}</p>
        ))}
      </div>
    </section>
  )
}

export default function ProjectsExperience() {
  const [locale, setLocale] = useState<Locale>("en")
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)

  const selected = projects.find((project) => project.slug === selectedSlug) ?? null

  if (selected) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 md:px-10">
          <div className="mb-10 flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedSlug(null)}
              className="text-sm text-neutral-500 transition hover:text-neutral-200"
            >
              {copy.backToProjects[locale]}
            </button>

            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>

          <header className="mb-24 border-b border-neutral-800 pb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
              {selected.type[locale]}
            </p>
            <h1 className="mt-3 text-4xl tracking-tight sm:text-5xl">
              {selected.name[locale]}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              {selected.oneLine[locale]}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-neutral-500">
              <span className="rounded-full border border-neutral-800 px-3 py-1">
                {selected.status[locale]}
              </span>
              <span>{selected.evolution[locale]}</span>
            </div>
          </header>

          <main className="space-y-20">
            {selected.slug === "ai-company-os" ? (
              <>
                <MultiLineSection
                  title={copy.labels.why[locale]}
                  lines={[copy.detail.aiWhy1[locale], copy.detail.aiWhy2[locale]]}
                />

                <MultiLineSection
                  title={copy.labels.insight[locale]}
                  lines={[copy.detail.aiInsight1[locale], copy.detail.aiInsight2[locale]]}
                />

                <Section title={copy.labels.field[locale]}>
                  {selected.field?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.focus[locale]}>
                  {selected.focus?.[locale] ?? ""}
                </Section>

                <MultiLineSection
                  title={copy.labels.approach[locale]}
                  lines={[
                    copy.detail.aiApproach1[locale],
                    copy.detail.aiApproach2[locale],
                    copy.detail.aiApproach3[locale],
                  ]}
                />

                <section>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-600">
                    {copy.labels.evolution[locale]}
                  </p>
                  <div className="mt-5 space-y-3 max-w-2xl text-base leading-8 text-neutral-300">
                    <p>{copy.detail.aiEvolution1[locale]}</p>
                    <p className="text-neutral-500">→</p>
                    <p>{copy.detail.aiEvolution2[locale]}</p>
                    <p className="text-neutral-500">→</p>
                    <p>{copy.detail.aiEvolution3[locale]}</p>
                  </div>
                </section>

                <Section title={copy.labels.reflection[locale]}>
                  {copy.detail.aiReflection[locale]}
                </Section>
              </>
            ) : selected.slug === "private-client-app" ? (
              <>
                <Section title={copy.labels.why[locale]}>
                  {copy.detail.clientWhy[locale]}
                </Section>
                <Section title={copy.labels.stack[locale]}>
                  {selected.stack?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.scope[locale]}>
                  {selected.scope?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.system[locale]}>
                  {selected.system?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.reflection[locale]}>
                  {copy.detail.clientReflection[locale]}
                </Section>
              </>
            ) : selected.slug === "mimamori" ? (
              <>
                <Section title={copy.labels.context[locale]}>
                  {copy.detail.mimamoriContext[locale]}
                </Section>
                <Section title={copy.labels.stack[locale]}>
                  {selected.stack?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.scope[locale]}>
                  {selected.scope?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.system[locale]}>
                  {selected.system?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.reflection[locale]}>
                  {copy.detail.mimamoriReflection[locale]}
                </Section>
              </>
            ) : (
              <>
                <Section title={copy.labels.origin[locale]}>
                  {copy.detail.oceanOrigin[locale]}
                </Section>
                <Section title={copy.labels.stack[locale]}>
                  {selected.stack?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.scope[locale]}>
                  {selected.scope?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.system[locale]}>
                  {selected.system?.[locale] ?? ""}
                </Section>
                <Section title={copy.labels.reflection[locale]}>
                  {copy.detail.oceanReflection[locale]}
                </Section>
              </>
            )}
          </main>

          <footer className="mt-28 border-t border-neutral-800 pt-8 text-sm text-neutral-500">
            {copy.footerDetail[locale]}
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-24 flex items-start justify-between gap-6">
          <div>
            <Link
              href="/"
              className="text-xs uppercase tracking-[0.22em] text-neutral-500 transition hover:text-neutral-200"
            >
              MASAAKI AI
            </Link>

            <section className="mt-6">
              <h1 className="text-3xl tracking-tight">{copy.pageTitle[locale]}</h1>
              <p className="mt-6 text-sm text-neutral-500">{copy.pageSubtitle[locale]}</p>
            </section>
          </div>

          <LocaleToggle locale={locale} onChange={setLocale} />
        </div>

        <section className="space-y-10">
          {projects.map((project, index) => {
            const isCore = project.slug === "ai-company-os"

            return (
              <Fragment key={project.slug}>
                {index === 1 ? (
                  <div className="my-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-neutral-800" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                      {copy.otherProjects[locale]}
                    </span>
                    <div className="h-px flex-1 bg-neutral-800" />
                  </div>
                ) : null}

                <button
                  onClick={() => setSelectedSlug(project.slug)}
                  className={`group block w-full rounded-2xl border p-8 text-left transition-all duration-500 ${
                    isCore
                      ? "border-neutral-700 bg-neutral-900/50 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] hover:border-neutral-500 hover:bg-neutral-900/70"
                      : "border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900/40"
                  }`}
                >
                  <p
                    className={`text-xs uppercase tracking-[0.2em] ${
                      isCore ? "text-neutral-400" : "text-neutral-600"
                    }`}
                  >
                    {project.type[locale]}
                  </p>

                  <h2
                    className={`mt-2 tracking-tight transition-transform duration-500 group-hover:translate-x-1 ${
                      isCore ? "text-3xl sm:text-[2rem]" : "text-2xl"
                    }`}
                  >
                    {project.name[locale]}
                  </h2>

                  <p
                    className={`mt-6 max-w-lg leading-relaxed transition-opacity duration-500 group-hover:opacity-80 ${
                      isCore ? "text-[1.05rem] text-neutral-200" : "text-base text-neutral-300"
                    }`}
                  >
                    {project.oneLine[locale]}
                  </p>

                  <div className="mt-8 grid gap-4 text-sm text-neutral-400">
                    {project.mode === "protected" ? (
                      <>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-neutral-600">
                            {copy.labels.field[locale]}
                          </p>
                          <p className="mt-1">{project.field?.[locale]}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-neutral-600">
                            {copy.labels.focus[locale]}
                          </p>
                          <p className="mt-1">{project.focus?.[locale]}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-neutral-600">
                            {copy.labels.status[locale]}
                          </p>
                          <p className="mt-1">{project.status[locale]}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-neutral-600">
                            {copy.labels.stack[locale]}
                          </p>
                          <p className="mt-1">{project.stack?.[locale]}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-neutral-600">
                            {copy.labels.scope[locale]}
                          </p>
                          <p className="mt-1">{project.scope?.[locale]}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-neutral-600">
                            {copy.labels.system[locale]}
                          </p>
                          <p className="mt-1">{project.system?.[locale]}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-neutral-600">
                            {copy.labels.status[locale]}
                          </p>
                          <p className="mt-1">{project.status[locale]}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-widest text-neutral-500 transition-all duration-500 group-hover:translate-x-1">
                      {project.evolution[locale]}
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-600 transition-all duration-500 group-hover:translate-x-1 group-hover:text-neutral-400">
                      {copy.viewProject[locale]}
                    </p>
                  </div>
                </button>
              </Fragment>
            )
          })}
        </section>

        <div className="mt-20 text-xs text-neutral-600">
          <p className="mb-4">{copy.footerList[locale]}</p>
          <p className="text-neutral-500">{copy.additionalProjects[locale]}</p>
        </div>
      </div>
    </div>
  )
}
