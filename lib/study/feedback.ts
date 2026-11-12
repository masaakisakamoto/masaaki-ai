import { readFile } from "fs/promises";
import path from "path";

type StructuredAnswerFeedbackPayload = {
  schemaVersion?: number;
  kind?: string;
  question?: string;
  answer?: unknown;
  usefulness?: unknown;
  bestAudience?: unknown;
  missing?: unknown;
};

export type FeedbackSummary = {
  count: number;
  summaryText: string;
};

// 集計に使ってよい値。ここにない値は数えない。
// 要約は AI への指示文に入るので、利用者が送った文字列をそのまま通さない。
const AUDIENCE_KEYS: readonly string[] = ["citizen", "school", "government"];
const MISSING_KEYS: readonly string[] = ["practice", "medical", "local"];
const USEFULNESS_VALUES: readonly number[] = [1, 2, 3];

const feedbackFile = path.join(
  process.cwd(),
  "data",
  "feedback",
  "entries.json"
);

function safeParseJSON<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function topKey(record: Record<string, number>): string | null {
  const first = Object.entries(record).sort((a, b) => b[1] - a[1])[0];
  return first?.[0] ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** 保存されたフィードバックから、AI への指示文に入れる要約を作る。 */
export function summarizeFeedback(entries: unknown, limit = 8): FeedbackSummary {
  const list = Array.isArray(entries) ? entries : [];

  const targets = list
    .filter(
      (entry): entry is Record<string, unknown> =>
        isRecord(entry) &&
        entry.type === "structured-answer" &&
        entry.area === "sports"
    )
    .slice(0, limit);

  if (targets.length === 0) {
    return {
      count: 0,
      summaryText: "",
    };
  }

  let usefulnessSum = 0;
  let usefulnessCount = 0;

  const audienceCount: Record<string, number> = {};
  const missingCount: Record<string, number> = {};

  for (const entry of targets) {
    if (typeof entry.message !== "string") continue;

    const parsed = safeParseJSON<StructuredAnswerFeedbackPayload>(entry.message);

    if (!isRecord(parsed)) continue;

    if (
      typeof parsed.usefulness === "number" &&
      USEFULNESS_VALUES.includes(parsed.usefulness)
    ) {
      usefulnessSum += parsed.usefulness;
      usefulnessCount += 1;
    }

    if (
      typeof parsed.bestAudience === "string" &&
      AUDIENCE_KEYS.includes(parsed.bestAudience)
    ) {
      audienceCount[parsed.bestAudience] =
        (audienceCount[parsed.bestAudience] ?? 0) + 1;
    }

    if (
      typeof parsed.missing === "string" &&
      MISSING_KEYS.includes(parsed.missing)
    ) {
      missingCount[parsed.missing] =
        (missingCount[parsed.missing] ?? 0) + 1;
    }
  }

  const averageUsefulness =
    usefulnessCount > 0
      ? (usefulnessSum / usefulnessCount).toFixed(2)
      : "N/A";

  const topAudience = topKey(audienceCount);
  const topMissing = topKey(missingCount);

  const improvementLines: string[] = [];

  if (topMissing === "practice") {
    improvementLines.push("実践は、頻度・時間・場面まで具体化する。");
  }

  if (topMissing === "medical") {
    improvementLines.push("根拠や前提条件を、断定しすぎず明示する。");
  }

  if (topMissing === "local") {
    improvementLines.push("深谷市や地域運用の文脈により具体化する。");
  }

  if (!improvementLines.length) {
    improvementLines.push("既存の構造を維持しつつ、明確で具体的に答える。");
  }

  const summaryText = [
    "直近フィードバック概要:",
    `- 件数: ${targets.length}`,
    `- 平均満足度: ${averageUsefulness}`,
    `- 最も役立った視点: ${topAudience ?? "不明"}`,
    `- 足りない要素: ${topMissing ?? "特になし"}`,
    "",
    "改善方針:",
    ...improvementLines.map((line) => `- ${line}`),
  ].join("\n");

  return {
    count: targets.length,
    summaryText,
  };
}

export async function getRecentFeedbackSummary(
  limit = 8
): Promise<FeedbackSummary> {
  let raw = "[]";

  try {
    raw = await readFile(feedbackFile, "utf-8");
  } catch {
    return {
      count: 0,
      summaryText: "",
    };
  }

  return summarizeFeedback(safeParseJSON<unknown>(raw), limit);
}
