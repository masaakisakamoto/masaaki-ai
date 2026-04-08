import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import StudyItemCard from "@/components/study/StudyItemCard";
import ShareMessageCard from "@/components/study/ShareMessageCard";
import SportsGuide from "@/components/study/SportsGuide";
import {
  categories,
  categoryOrder,
  getItemsByCategory,
  isStudyCategoryKey,
  sportsFocusAreas,
  sportsProjectIdeas,
  sportsPrograms,
  sportsCityApplications,
  sportsProgramGroups,
  sportsAudienceNavigation,
  sportsPublicIntro,
  sportsShareMessage,
  sportsFeaturedAthletes,
} from "@/data/study/content";

export function generateStaticParams() {
  return categoryOrder.map((category) => ({ category }));
}

export default async function StudyCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!isStudyCategoryKey(category)) {
    notFound();
  }

  const categoryData = categories[category];
  const items = getItemsByCategory(category);

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/study"
          className="text-sm uppercase tracking-[0.24em] text-black/45 transition hover:text-black"
        >
          Study
        </Link>

        <section className="mt-8 max-w-3xl">
          {category === "sports" ? (
            <section className="mt-10">
              <div className="rounded-[28px] border border-black/8 bg-black/[0.02] p-5 md:p-7">
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                  Overview
                </p>
                <h2 className="mt-4 text-2xl font-medium tracking-tight">
                  {sportsPublicIntro.title}
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-black/68">
                  {sportsPublicIntro.description}
                </p>
              </div>
            </section>
          ) : null}

          <p className="mt-12 text-sm uppercase tracking-[0.24em] text-black/45">
            {categoryData.title}
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
            {categoryData.title}
          </h1>
          <p className="mt-6 text-base leading-8 text-black/68 md:text-lg">
            {categoryData.heroDescription}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {categoryData.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {category === "sports" ? (
          <section className="mt-12">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Navigation
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              誰に向けた内容か
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {sportsAudienceNavigation.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="rounded-2xl border border-black/10 p-6 transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                >
                  <h3 className="text-base font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-black/70">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {category === "sports" ? (
          <section className="mt-16">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Activity image
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              スポーツ推進委員の活動イメージ
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
              地域でスポーツを広げていくには、イベントだけでなく、
              日常の中で人と人をつなぐ存在も大切です。
              スポーツ推進委員は、そうした地域の実践を支える役割のひとつです。
            </p>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
              <Image
                src="/images/sports-promotion-committee-image.png"
                alt="スポーツ推進委員の活動イメージ"
                width={1536}
                height={1024}
                className="h-auto w-full"
                priority={false}
              />

              <div className="p-6">
                <p className="text-sm leading-7 text-black/70">
                  地域での声かけや運動機会づくりを支える人の存在があることで、
                  スポーツはイベントだけでなく、暮らしの中にも広がっていきます。
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {category === "sports" ? <SportsGuide /> : null}

        {category === "sports" ? (
          <section id="sports-city-application" className="mt-16 scroll-mt-24">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Fukaya city application
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              深谷市スポーツ推進で活かす視点
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {sportsCityApplications.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/10 p-6"
                >
                  <h3 className="text-base font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-black/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {category === "sports" ? (
          <>
            <section className="mt-16 grid gap-8 lg:grid-cols-2">
              <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                  Focus areas
                </p>
                <h2 className="mt-4 text-2xl font-medium tracking-tight">
                  スポーツ推進の重点領域
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  {sportsFocusAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/70"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-black/8 bg-white p-8 shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                  Community implementation
                </p>
                <h2 className="mt-4 text-2xl font-medium tracking-tight">
                  深谷市につなげる企画の種
                </h2>
                <div className="mt-6 space-y-4">
                  {sportsProjectIdeas.map((idea) => (
                    <div
                      key={idea.title}
                      className="rounded-2xl bg-black/[0.03] p-4"
                    >
                      <h3 className="text-base font-medium tracking-tight">
                        {idea.title}
                      </h3>
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

            <section className="mt-16">
              <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                Programs
              </p>
              <h2 className="mt-4 text-2xl font-medium tracking-tight">
                実行できるスポーツプログラム
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
                親子・高齢者・学校を起点に、地域の中で実際に動かせるプログラムの形へ整理しています。
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {sportsProgramGroups.map((group) => (
                  <a
                    key={group.key}
                    href={`#sports-programs-${group.key}`}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/70 transition hover:bg-black/[0.04] hover:text-black"
                  >
                    {group.title}
                  </a>
                ))}
              </div>

              <div className="mt-8 space-y-6">
                {sportsProgramGroups.map((group) => {
                  const filteredPrograms = sportsPrograms.filter((program) => {
                    if (group.key === "family") {
                      return program.target.includes("保護者");
                    }

                    if (group.key === "school") {
                      return program.target.includes("小中学生");
                    }

                    if (group.key === "elderly") {
                      return program.target.includes("高齢者");
                    }

                    return false;
                  });

                  if (filteredPrograms.length === 0) {
                    return null;
                  }

                  return (
                    <section
                      key={group.key}
                      id={`sports-programs-${group.key}`}
                      className="scroll-mt-24"
                    >
                      <details className="group rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-start justify-between gap-6">
                            <div className="max-w-3xl">
                              <h3 className="text-xl font-medium tracking-tight">
                                {group.title}
                              </h3>
                              <p className="mt-3 text-sm leading-7 text-black/68">
                                {group.description}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <span className="rounded-full border border-black/10 px-3 py-1 text-xs text-black/60">
                                {filteredPrograms.length} programs
                              </span>

                              <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/55">
                                <span className="group-open:hidden">開く</span>
                                <span className="hidden group-open:inline">閉じる</span>
                              </span>
                            </div>
                          </div>
                        </summary>

                        <div className="mt-6 space-y-6">
                          {filteredPrograms.map((program, index) => (
                            <div
                              key={program.title}
                              className="rounded-2xl border border-black/10 p-6"
                            >
                              <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white">
                                  {index + 1}
                                </span>
                                <h4 className="text-lg font-medium">{program.title}</h4>
                              </div>

                              <p className="mt-2 text-sm text-black/70">
                                {program.purpose}
                              </p>

                              <div className="mt-4 text-sm text-black/60">
                                対象: {program.target} / 時間: {program.duration} / 頻度:{" "}
                                {program.frequency}
                              </div>

                              <ul className="mt-4 space-y-1 text-sm text-black/70">
                                {program.structure.map((s, i) => (
                                  <li key={i}>・{s}</li>
                                ))}
                              </ul>

                              <div className="mt-4 rounded-2xl bg-black/[0.03] p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                                  Expected outcome
                                </p>
                                <p className="mt-2 text-sm leading-7 text-black/70">
                                  {program.expectedOutcome}
                                </p>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {program.connection.map((item) => (
                                  <span
                                    key={item}
                                    className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </details>
                    </section>
                  );
                })}
              </div>
            </section>
          </>
        ) : null}

        {category !== "sports" ? (
          <section className="mt-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                  Items
                </p>
                <h2 className="mt-4 text-3xl font-medium tracking-tight">
                  {categoryData.title} items
                </h2>
              </div>

              <Link
                href="/study/feedback"
                className="text-sm text-black/68 underline underline-offset-4 transition hover:text-black"
              >
                Share feedback
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <StudyItemCard key={item.slug} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {category === "sports" ? (
          <section className="mt-16">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Local example
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              深谷で親しまれている身近な運動
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
              深谷では、日常の中で親しみやすく体を動かす機会として、
              地域に根づいた運動文化があります。
              ふっかちゃん体操は、その身近な実践例のひとつです。
            </p>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_10px_34px_rgba(0,0,0,0.04)]">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/boCci3-a-5Q"
                  title="ふっかちゃん体操"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className="p-6">
                <p className="text-sm leading-7 text-black/70">
                  こうした地域の身近な運動があることで、運動は暮らしの中へ広がりやすくなります。
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {category === "sports" ? (
          <section className="mt-16">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Role models
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              深谷にゆかりのあるアスリート
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
              地域で親しまれている運動だけでなく、深谷にゆかりのあるアスリートの存在も、
              スポーツを身近に感じるきっかけになります。
              市民・学校・地域にとって、挑戦や継続を考えるうえでの大切なロールモデルです。
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {sportsFeaturedAthletes.map((athlete) => (
                <div
                  key={athlete.name}
                  className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                    {athlete.sport}
                  </p>
                  <h3 className="mt-3 text-xl font-medium tracking-tight">
                    {athlete.name}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-black/70">
                    {athlete.description}
                  </p>

                  <div className="mt-4 rounded-2xl bg-black/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                      Why it matters
                    </p>
                    <p className="mt-2 text-sm leading-7 text-black/70">
                      {athlete.connection}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {category === "sports" ? (
          <section className="mt-16">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Local record
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              ふかやシティハーフマラソンの活動記録
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
              地域の中で多くの人が関わるスポーツイベントは、運動習慣づくりだけでなく、
              地域のつながりや挑戦の機会にもなります。
              ふかやシティハーフマラソンは、深谷における代表的な実践例のひとつです。
            </p>

            <div className="mt-8 rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-7">
              <p className="text-sm leading-7 text-black/70">
                大会そのものを見るだけでなく、こうした場がどのように地域のスポーツ文化を支えているかを考えるきっかけにもなります。
                市民の参加、挑戦の機会、地域の一体感という面からも、深谷のスポーツ推進を考えるうえで大切な実践のひとつです。
              </p>

              <div className="mt-6">
                <a
                  href="https://www.city.fukaya.saitama.jp/kurashi/sports/sports/sportevent/index.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-black/75 underline underline-offset-4 transition hover:text-black"
                >
                  深谷市のスポーツイベント情報を見る
                </a>
              </div>
            </div>
          </section>
        ) : null}

        {category === "sports" ? (
          <section className="mt-16">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Activity record
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              令和7年度スポーツ推進委員活動スケジュール【参考】
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
              昨年は、定例会や研修会に加え、市民向けイベント、学校でのスポーツ教室、
              地域での体験会、ふかやシティハーフマラソンの運営協力など、
              年間を通して幅広く活動しました。
            </p>

            <div className="mt-8 rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-7">
              <ul className="space-y-2 text-sm leading-7 text-black/72">
                <li>・運営・会議・研修　34件</li>
                <li>・学校・地域での教室や体験会　18件</li>
                <li>・市民向けイベント・実践　11件</li>
                <li>・ふかやシティハーフマラソン関連　5件</li>
              </ul>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                  Main examples
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-black/72">
                  <li>・5/18　ウォーキング大寄</li>
                  <li>・7/25　みんなでラジオ体操</li>
                  <li>・9/6　市民体力測定・深谷</li>
                  <li>・10/26　福祉健康まつり</li>
                  <li>・11/16　青淵まつりでのふっかちゃん体操</li>
                  <li>・2/22　20thふかやシティハーフマラソン</li>
                </ul>
              </div>
            </div>
          </section>
        ) : null}

        {category === "sports" ? (
          <section className="mt-16">
            <ShareMessageCard
              title={sportsShareMessage.title}
              description={sportsShareMessage.description}
              shortMessage={sportsShareMessage.shortMessage}
            />
          </section>
        ) : null}
      </div>
    </main>
  );
}
