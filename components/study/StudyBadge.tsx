type BadgeKind = "audience" | "freshness";

const audienceMap = {
  pro: "Pro",
  simple: "Simple",
  both: "Both",
} as const;

const freshnessMap = {
  core: "Core",
  updated: "Updated",
  frontier: "Frontier",
} as const;

export default function StudyBadge({
  kind,
  value,
}: {
  kind: BadgeKind;
  value: string;
}) {
  const label =
    kind === "audience"
      ? audienceMap[value as keyof typeof audienceMap]
      : freshnessMap[value as keyof typeof freshnessMap];

  return (
    <span className="inline-flex items-center rounded-full border border-black/10 px-3 py-1 text-xs tracking-wide text-black/70">
      {label}
    </span>
  );
}
