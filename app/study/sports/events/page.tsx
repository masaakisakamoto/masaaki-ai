import Link from "next/link";
import { sportsSampleEvents } from "@/data/study/content";

export default function SportsEventsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/study/sports"
          className="text-sm uppercase tracking-[0.24em] text-black/45 transition hover:text-black"
        >
          Sports
        </Link>

        <section className="mt-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-black/45">
            Events
          </p>
          <h1 className="mt-5 text-4xl font-medium tracking-tight md:text-6xl">
            地域のスポーツイベント
          </h1>
          <p className="mt-8 text-base leading-8 text-black/68 md:text-lg">
            地域で行われるスポーツイベントを、わかりやすく見られる形でまとめていくための一覧ページです。
            今後、登録団体による掲載申請をもとに、内容を少しずつ充実させていきます。
          </p>

          <div className="mt-6 rounded-2xl bg-black/[0.03] p-4">
            <p className="text-sm leading-7 text-black/60">
              ※ 現在は表示例としてのテストデータを掲載しています。
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sportsSampleEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-black/45">
                  {event.date}
                </p>
                <h2 className="mt-3 text-xl font-medium tracking-tight">
                  {event.title}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60">
                    対象: {event.target}
                  </span>
                  <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60">
                    参加費: {event.fee}
                  </span>
                  <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60">
                    {event.applyMethod}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm leading-7 text-black/68">
                  <p>場所: {event.location}</p>
                  <p>主催: {event.organizer}</p>
                </div>

                <p className="mt-5 text-sm leading-7 text-black/72">
                  {event.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] md:p-7">
            <p className="text-sm uppercase tracking-[0.24em] text-black/45">
              Participation
            </p>
            <h2 className="mt-4 text-2xl font-medium tracking-tight">
              団体登録・イベント掲載申請はこちら
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-black/68">
              地域で活動している団体の登録や、イベント掲載の申請は専用フォームから受け付けています。
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/study/sports/organizations/register"
                className="text-sm text-black/75 underline underline-offset-4 transition hover:text-black"
              >
                団体登録フォームを開く
              </Link>
              <Link
                href="/study/sports/events/request"
                className="text-sm text-black/75 underline underline-offset-4 transition hover:text-black"
              >
                イベント掲載申請フォームを開く
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
