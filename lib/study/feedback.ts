import { readFile } from "fs/promises";
import path from "path";

type FeedbackEntry = {
  id: string;
  createdAt: string;
  type: string;
  area: string;
  audience: string;
  pageUrl?: string;
  name?: string;
  email?: string;
  message: string;
  status: "new";
};

type StructuredAnswerFeedbackPayload = {
  schemaVersion?: number;
  kind?: string;
  question?: string;
  answer?: unknown;
  usefulness?: number;
  bestAudience?: string | null;
  missing?: string | null;
};

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

export async function getRecentFeedbackSummary(limit = 8) {
  let raw = "[]";

  try {
    raw = await readFile(feedbackFile, "utf-8");
  } catch {
    return {
      count: 0,
      summaryText: "",
    };
  }

  const entries = safeParseJSON<FeedbackEntry[]>(raw) ?? [];

  const targets = entries
    .filter((entry) => entry.type === "structured-answer" && entry.area === "sports")
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
    const parsed = safeParseJSON<StructuredAnswerFeedbackPayload>(entry.message);

    if (!parsed) continue;

    if (typeof parsed.usefulness === "number") {
      usefulnessSum += parsed.usefulness;
      usefulnessCount += 1;
    }

    if (parsed.bestAudience) {
      audienceCount[parsed.bestAudience] =
        (audienceCount[parsed.bestAudience] ?? 0) + 1;
    }

    if (parsed.missing) {
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
