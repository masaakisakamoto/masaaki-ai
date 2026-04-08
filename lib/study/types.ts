export type AudienceLens = "citizen" | "school" | "government";

export type StructuredAnswer = {
  title: string;
  summary: string;
  coreUnderstanding: string;
  evidenceBasis: string;
  practice: string[];
  audienceViews: {
    citizen: string;
    school: string;
    government: string;
  };
  nextAction: string;
  confidenceNote?: string;
};

export function isStructuredAnswer(value: unknown): value is StructuredAnswer {
  if (!value || typeof value !== "object") return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.title === "string" &&
    typeof v.summary === "string" &&
    typeof v.coreUnderstanding === "string" &&
    typeof v.evidenceBasis === "string" &&
    Array.isArray(v.practice) &&
    v.practice.every((item) => typeof item === "string") &&
    typeof v.nextAction === "string" &&
    typeof v.audienceViews === "object" &&
    v.audienceViews !== null &&
    typeof (v.audienceViews as Record<string, unknown>).citizen === "string" &&
    typeof (v.audienceViews as Record<string, unknown>).school === "string" &&
    typeof (v.audienceViews as Record<string, unknown>).government === "string" &&
    (v.confidenceNote === undefined || typeof v.confidenceNote === "string")
  );
}
