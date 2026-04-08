import Link from "next/link";
import StudyItemCard from "@/components/study/StudyItemCard";
import {
  categories,
  categoryOrder,
  getFeaturedItems,
  sportsProjectIdeas,
  studyPrinciples,
} from "@/data/study/content";

export default function StudyPage() {
  const featured = getFeaturedItems();

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <section className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-black/45">Study</p>
          <h1 className="mt-6 text-4xl font-medium tracking-tight md:text-6xl">
            人間、医学、技術。
            <br />
            学びをつなぎ、実践へ。
          </h1>
          <p className="mt-8 text-base leading-8 text-black/68 md:text-lg">
            Human Systems・Medical・AI・Sports・Longevityを横断し、
            <br className="hidden md:block" />
            知識を理解し、根拠を持ち、実践と社会に接続するための場。
            <br className="hidden md:block" />
            この空間は、完成品ではなく、育ち続けていきます。
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/study/sports"
              className="rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90"
            >
              Open Sports
            </Link>
            <Link
              href="/study/feedback"
              className="rounded-full border border-black/10 px-6 py-3 text-sm text-black/75 transition hover:border-black/20 hover:text-black"
            >
              Share feedback
            </Link>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {studyPrinciples.map((principle) => (
            <div
              key={principle.title}
              className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            >
              <h2 className="text-lg font-medium tracking-tight">{principle.title}</h2>
              <p className="mt-3 text-sm leading-7 text-black/65">
                {principle.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="rounded-[32px] border border-black/8 bg-black/[0.02] p-8 shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Featured path
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              埼玉県深谷市スポーツ推進委員として、深谷市のスポーツ推進を考えていく
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
              市民・学校・行政の橋渡しとして、スポーツ推進をどう実践につなげていくかを整理し始めたページです。
              深谷市の文脈に合わせて、今後さらに育てていきます。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/study/sports"
                className="rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90"
              >
                Open Sports
              </Link>
              <Link
                href="/study/feedback"
                className="rounded-full border border-black/10 px-6 py-3 text-sm text-black/75 transition hover:bg-black/[0.04] hover:text-black"
              >
                Share feedback
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                Categories
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight">
                育ち続ける知識空間
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categoryOrder.map((key) => (
              <Link
                key={key}
                href={`/study/${key}`}
                className="rounded-[30px] border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]"
              >
                <p className="text-sm uppercase tracking-[0.22em] text-black/40">
                  {categories[key].title}
                </p>
                <p className="mt-4 text-base leading-8 text-black/72">
                  {categories[key].shortDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {categories[key].tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Two ways to learn
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-medium tracking-tight">Pro View</h3>
                <p className="mt-3 text-sm leading-7 text-black/68">
                  構造、判断軸、背景理解、実務接続を重視。
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium tracking-tight">Simple View</h3>
                <p className="mt-3 text-sm leading-7 text-black/68">
                  全体像、やさしい言葉、最初の入口を重視。
                </p>
              </div>
            </div>
            <p className="mt-8 text-sm leading-7 text-black/58">
              同じテーマでも、深く学びたい人と、まず理解したい人では入口が違います。
              Studyでは、その両方を大切にします。
            </p>
          </div>

          <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Sports and community
            </p>
            <h3 className="mt-4 text-2xl font-medium tracking-tight">
              自治体との接続（深谷市）
            </h3>
            <p className="mt-4 text-sm leading-7 text-black/68">
              Sports は、知識を、実際の人の行動に変える領域。
              市民・小中学校・地域の場へつなぐ現場の入口として育てていきます。
            </p>

            <div className="mt-6 space-y-4">
              {sportsProjectIdeas.map((idea) => (
                <div key={idea.title} className="rounded-2xl bg-black/[0.03] p-4">
                  <h4 className="text-base font-medium tracking-tight">{idea.title}</h4>
                  <p className="mt-2 text-sm leading-7 text-black/70">
                    {idea.description}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-black/42">
                    {idea.connection}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <p className="text-sm uppercase tracking-[0.24em] text-black/45">
            Featured
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {featured.map((item) => (
              <StudyItemCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-[32px] border border-black/8 bg-black/[0.02] p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-black/45">Feedback</p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight">
            This space is evolving.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/68">
            ご意見や「こういう情報がほしい」をぜひ教えてください。
            その声は、この知識空間を次に進めるための大切なヒントになります。
          </p>
          <div className="mt-8">
            <Link
              href="/study/feedback"
              className="rounded-full bg-black px-6 py-3 text-sm text-white transition hover:opacity-90"
            >
              Open feedback form
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
