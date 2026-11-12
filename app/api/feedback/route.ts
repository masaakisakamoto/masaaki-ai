import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

import { createRateLimiter } from "@/lib/security/rate-limit";
import {
  clientKeyFrom,
  isCrossSiteRequest,
  isJsonRequest,
  readJsonBody,
} from "@/lib/security/request";
import { validateFeedback } from "@/lib/security/validate";

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

const feedbackDir = path.join(process.cwd(), "data", "feedback");
const feedbackFile = path.join(feedbackDir, "entries.json");

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

// 数字は運用に合わせて調整する。
// メモリ上の制限なので、インスタンスをまたぐ上限にはならない（docs/api-guard.md）。
const limiter = createRateLimiter({
  perClient: [
    { limit: 5, windowMs: MINUTE },
    { limit: 30, windowMs: DAY },
  ],
  global: [
    { limit: 60, windowMs: MINUTE },
    { limit: 1000, windowMs: DAY },
  ],
});

const MAX_BODY_BYTES = 100 * 1024;

function reject(
  status: number,
  error: string,
  headers?: Record<string, string>
) {
  return NextResponse.json({ ok: false, error }, { status, headers });
}

export async function POST(req: NextRequest) {
  if (isCrossSiteRequest(req.headers)) {
    return reject(403, "このサイトのページからご利用ください。");
  }
  if (!isJsonRequest(req.headers)) {
    return reject(415, "送信内容の形式が正しくありません。");
  }

  const body = await readJsonBody(req, MAX_BODY_BYTES);
  if (!body.ok) {
    return reject(body.status, body.error);
  }

  const input = validateFeedback(body.value);
  if (!input.ok) {
    return reject(400, input.error);
  }

  const decision = limiter.check(clientKeyFrom(req.headers));
  if (!decision.allowed) {
    return reject(
      429,
      "送信が集中しています。少し時間をおいてからお試しください。",
      { "Retry-After": String(decision.retryAfterSeconds) }
    );
  }

  const entry: FeedbackEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input.value,
    status: "new",
  };

  await mkdir(feedbackDir, { recursive: true });

  let current: FeedbackEntry[] = [];
  try {
    const raw = await readFile(feedbackFile, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    current = Array.isArray(parsed) ? (parsed as FeedbackEntry[]) : [];
  } catch {
    current = [];
  }

  current.unshift(entry);
  await writeFile(feedbackFile, JSON.stringify(current, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
