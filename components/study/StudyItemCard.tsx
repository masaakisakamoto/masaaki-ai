import Link from "next/link";
import StudyBadge from "./StudyBadge";
import { StudyItem } from "@/data/study/content";

export default function StudyItemCard({ item }: { item: StudyItem }) {
  const isExternal = item.sourceType === "external";

  return (
    <article className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex flex-wrap gap-2">
        <StudyBadge kind="audience" value={item.audience} />
        <StudyBadge kind="freshness" value={item.freshness} />
      </div>

      <h3 className="text-xl font-medium tracking-tight text-black">{item.title}</h3>

      <p className="mt-3 text-sm leading-7 text-black/72">{item.summary}</p>

      <div className="mt-4 rounded-2xl bg-black/[0.03] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-black/45">
          Why it matters
        </p>
        <p className="mt-2 text-sm leading-7 text-black/78">{item.whyItMatters}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/[0.04] px-3 py-1 text-xs text-black/60"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={item.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="text-sm text-black/75 underline underline-offset-4 transition hover:text-black"
        >
          {isExternal ? "Open source" : "Open category"}
        </Link>
      </div>
    </article>
  );
}
