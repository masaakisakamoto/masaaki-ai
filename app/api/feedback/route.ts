import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

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

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body?.message || typeof body.message !== "string") {
    return NextResponse.json(
      { ok: false, error: "message is required" },
      { status: 400 }
    );
  }

  const entry: FeedbackEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    type: body.type ?? "other",
    area: body.area ?? "other",
    audience: body.audience ?? "",
    pageUrl: body.pageUrl ?? "",
    name: body.name ?? "",
    email: body.email ?? "",
    message: body.message,
    status: "new",
  };

  await mkdir(feedbackDir, { recursive: true });

  let current: FeedbackEntry[] = [];
  try {
    const raw = await readFile(feedbackFile, "utf-8");
    current = JSON.parse(raw) as FeedbackEntry[];
  } catch {
    current = [];
  }

  current.unshift(entry);
  await writeFile(feedbackFile, JSON.stringify(current, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
