/**
 * API が受け取る入力の検証。外部の依存を使わない。
 */

export type Validated<T> = { ok: true; value: T } | { ok: false; error: string };

/** AIガイドへの質問の長さの上限（文字数） */
export const GUIDE_MESSAGE_MAX = 500;

/** フィードバックの各項目の長さの上限（文字数） */
export const FEEDBACK_LIMITS = {
  slug: 64,
  pageUrl: 300,
  name: 100,
  email: 254,
  message: 20000,
} as const;

export type FeedbackInput = {
  type: string;
  area: string;
  audience: string;
  pageUrl: string;
  name: string;
  email: string;
  message: string;
};

// 改行とタブ以外の制御文字
const CONTROL_EXCEPT_NEWLINES = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
// 改行とタブを含む制御文字
const CONTROL_AND_NEWLINES = /[\x00-\x1F\x7F]+/g;
// 種別などに使う短い識別子。例: sports-request
const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function lengthOf(text: string): number {
  return Array.from(text).length;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateGuideMessage(input: unknown): Validated<string> {
  if (typeof input !== "string") {
    return { ok: false, error: "質問を入力してください。" };
  }

  const message = input
    .replace(CONTROL_AND_NEWLINES, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!message) {
    return { ok: false, error: "質問を入力してください。" };
  }
  if (lengthOf(message) > GUIDE_MESSAGE_MAX) {
    return {
      ok: false,
      error: `質問は${GUIDE_MESSAGE_MAX}文字以内でお願いします。`,
    };
  }

  return { ok: true, value: message };
}

function readSlug(
  value: unknown,
  fallback: string,
  allowEmpty: boolean
): string | null {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== "string") return null;
  if (value === "") return allowEmpty ? "" : null;
  if (value.length > FEEDBACK_LIMITS.slug || !SLUG.test(value)) return null;
  return value;
}

function readText(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const text = value.replace(CONTROL_AND_NEWLINES, " ").trim();
  return lengthOf(text) > max ? null : text;
}

export function validateFeedback(body: unknown): Validated<FeedbackInput> {
  if (!isRecord(body)) {
    return { ok: false, error: "送信内容の形式が正しくありません。" };
  }

  if (typeof body.message !== "string") {
    return { ok: false, error: "message is required" };
  }
  const message = body.message.replace(CONTROL_EXCEPT_NEWLINES, "").trim();
  if (!message) {
    return { ok: false, error: "message is required" };
  }
  if (lengthOf(message) > FEEDBACK_LIMITS.message) {
    return { ok: false, error: "本文が長すぎます。" };
  }

  const type = readSlug(body.type, "other", false);
  const area = readSlug(body.area, "other", false);
  const audience = readSlug(body.audience, "", true);
  if (type === null || area === null || audience === null) {
    return { ok: false, error: "種別の指定が正しくありません。" };
  }

  const pageUrl = readText(body.pageUrl, FEEDBACK_LIMITS.pageUrl);
  const name = readText(body.name, FEEDBACK_LIMITS.name);
  const email = readText(body.email, FEEDBACK_LIMITS.email);
  if (pageUrl === null || name === null || email === null) {
    return { ok: false, error: "入力が長すぎるか、形式が正しくありません。" };
  }
  if (email !== "" && !EMAIL.test(email)) {
    return { ok: false, error: "メールアドレスの形式が正しくありません。" };
  }

  return {
    ok: true,
    value: { type, area, audience, pageUrl, name, email, message },
  };
}
