import assert from "node:assert/strict";
import { test } from "node:test";

import {
  clientKeyFrom,
  isCrossSiteRequest,
  isJsonRequest,
  readJsonBody,
} from "../lib/security/request.ts";

function post(body, headers = {}) {
  return new Request("https://example.test/api", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

test("送信元: Vercel のヘッダーを優先し、先頭のアドレスを使う", () => {
  assert.equal(
    clientKeyFrom(new Headers({
      "x-vercel-forwarded-for": "203.0.113.5",
      "x-real-ip": "198.51.100.1",
      "x-forwarded-for": "192.0.2.1",
    })),
    "203.0.113.5"
  );
  assert.equal(clientKeyFrom(new Headers({ "x-forwarded-for": " 192.0.2.1 , 10.0.0.1" })), "192.0.2.1");
  assert.equal(clientKeyFrom(new Headers({ "x-real-ip": "198.51.100.1" })), "198.51.100.1");
});

test("送信元: ヘッダーがなければ unknown、長すぎる値は切り詰める", () => {
  assert.equal(clientKeyFrom(new Headers()), "unknown");
  assert.equal(clientKeyFrom(new Headers({ "x-forwarded-for": " , " })), "unknown");
  assert.equal(clientKeyFrom(new Headers({ "x-forwarded-for": "a".repeat(500) })).length, 64);
});

test("ほかのサイトからのブラウザ経由の呼び出しだけを見分ける", () => {
  assert.equal(isCrossSiteRequest(new Headers({ "sec-fetch-site": "cross-site" })), true);
  assert.equal(isCrossSiteRequest(new Headers({ "sec-fetch-site": "Cross-Site" })), true);
  for (const value of ["same-origin", "same-site", "none"]) {
    assert.equal(isCrossSiteRequest(new Headers({ "sec-fetch-site": value })), false, value);
  }
  // 古いブラウザやブラウザ以外はヘッダーを付けない。ここでは止めない
  assert.equal(isCrossSiteRequest(new Headers()), false);
});

test("JSON の送信かどうかを見分ける", () => {
  assert.equal(isJsonRequest(new Headers({ "content-type": "application/json" })), true);
  assert.equal(isJsonRequest(new Headers({ "content-type": "Application/JSON; charset=utf-8" })), true);
  assert.equal(isJsonRequest(new Headers({ "content-type": "text/plain" })), false);
  assert.equal(isJsonRequest(new Headers({ "content-type": "application/x-www-form-urlencoded" })), false);
  assert.equal(isJsonRequest(new Headers()), false);
});

test("本文: JSON を読む", async () => {
  assert.deepEqual(await readJsonBody(post('{"message":"こんにちは"}'), 1024), {
    ok: true,
    value: { message: "こんにちは" },
  });
});

test("本文: JSON でなければ 400", async () => {
  for (const body of ["", "{", "message=a", "undefined"]) {
    const result = await readJsonBody(post(body), 1024);
    assert.equal(result.ok, false, body);
    assert.equal(result.status, 400, body);
  }
});

test("本文: 申告された大きさが上限を超えていれば、読まずに 413", async () => {
  const req = post("{}", { "content-length": "999999" });
  const result = await readJsonBody(req, 1024);
  assert.equal(result.status, 413);
  assert.equal(req.bodyUsed, false);
});

test("本文: 実際の大きさが上限を超えていれば 413（バイト数で数える）", async () => {
  const within = JSON.stringify({ message: "a".repeat(100) });
  assert.equal((await readJsonBody(post(within), 200)).ok, true);

  // 日本語は1文字が3バイト。文字数では上限内でも、バイト数で超える
  const japanese = JSON.stringify({ message: "あ".repeat(100) });
  assert.ok(japanese.length < 200);
  const result = await readJsonBody(post(japanese), 200);
  assert.equal(result.ok, false);
  assert.equal(result.status, 413);
});
