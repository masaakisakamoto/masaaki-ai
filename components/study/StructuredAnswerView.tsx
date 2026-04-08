import type { StructuredAnswer } from "@/lib/study/types";

type Props = {
  answer: StructuredAnswer;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-black/70">
        {title}
      </h3>
      <div className="text-[15px] leading-7 text-black/85">{children}</div>
    </section>
  );
}

export default function StructuredAnswerView({ answer }: Props) {
  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-black/45">
          Structured Answer
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-black">
          {answer.title}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-black/75">
          {answer.summary}
        </p>
      </section>

      <Section title="本質理解">
        <p>{answer.coreUnderstanding}</p>
      </Section>

      <Section title="根拠・前提">
        <p>{answer.evidenceBasis}</p>
      </Section>

      <Section title="実践">
        <ul className="space-y-2">
          {answer.practice.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3">
              <span className="mt-[2px] text-black/40">{index + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-black/70">
          社会への翻訳
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-black/[0.03] p-4">
            <p className="mb-2 text-sm font-semibold text-black">市民</p>
            <p className="text-[15px] leading-7 text-black/80">
              {answer.audienceViews.citizen}
            </p>
          </div>

          <div className="rounded-2xl bg-black/[0.03] p-4">
            <p className="mb-2 text-sm font-semibold text-black">学校</p>
            <p className="text-[15px] leading-7 text-black/80">
              {answer.audienceViews.school}
            </p>
          </div>

          <div className="rounded-2xl bg-black/[0.03] p-4">
            <p className="mb-2 text-sm font-semibold text-black">行政</p>
            <p className="text-[15px] leading-7 text-black/80">
              {answer.audienceViews.government}
            </p>
          </div>
        </div>
      </section>

      <Section title="次の一歩">
        <p>{answer.nextAction}</p>
      </Section>

      {answer.confidenceNote ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-amber-900">
            Confidence Note
          </h3>
          <p className="text-[15px] leading-7 text-amber-900/85">
            {answer.confidenceNote}
          </p>
        </section>
      ) : null}
    </div>
  );
}
