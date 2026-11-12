/**
 * リクエストから、回数制限と検証に必要な情報を取り出す。外部の依存を使わない。
 */

/**
 * 回数制限に使う送信元の識別子。
 *
 * Vercel は x-forwarded-for を自分で上書きするので、利用者が偽ることはできない。
 * Vercel 以外で動かす場合は、手前のプロキシがこのヘッダーを上書きしていることを確かめる。
 * 偽られた場合でも、全体の上限（rate-limit.ts の global）は効く。
 */
export function clientKeyFrom(headers: Headers): string {
  const candidates = [
    headers.get("x-vercel-forwarded-for"),
    headers.get("x-real-ip"),
    headers.get("x-forwarded-for"),
  ];

  for (const value of candidates) {
    const first = value?.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }

  return "unknown";
}

/**
 * ほかのサイトのページから、ブラウザ経由で呼ばれたかどうか。
 * ブラウザが自動で付ける Sec-Fetch-Site を見る。ブラウザ以外からの呼び出しは判定できない。
 */
export function isCrossSiteRequest(headers: Headers): boolean {
  return headers.get("sec-fetch-site")?.toLowerCase() === "cross-site";
}

export function isJsonRequest(headers: Headers): boolean {
  return (headers.get("content-type") ?? "")
    .toLowerCase()
    .includes("application/json");
}

export type JsonBody =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; error: string };

/** 大きさの上限を確かめてから、本文を JSON として読む。 */
export async function readJsonBody(
  req: Request,
  maxBytes: number
): Promise<JsonBody> {
  const tooLarge: JsonBody = {
    ok: false,
    status: 413,
    error: "送信内容が大きすぎます。",
  };

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) return tooLarge;

  let text: string;
  try {
    text = await req.text();
  } catch {
    return { ok: false, status: 400, error: "送信内容を読み取れませんでした。" };
  }

  if (new TextEncoder().encode(text).length > maxBytes) return tooLarge;

  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400, error: "送信内容を読み取れませんでした。" };
  }
}
