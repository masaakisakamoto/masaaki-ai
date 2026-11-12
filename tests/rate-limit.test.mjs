import assert from "node:assert/strict";
import { test } from "node:test";

import { createRateLimiter } from "../lib/security/rate-limit.ts";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const T0 = 1_000_000_000_000;

test("上限までは許可し、超えたら拒否して待ち時間を返す", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 3, windowMs: MINUTE }],
    global: [],
  });

  assert.deepEqual(limiter.check("a", T0), { allowed: true });
  assert.deepEqual(limiter.check("a", T0 + 1000), { allowed: true });
  assert.deepEqual(limiter.check("a", T0 + 2000), { allowed: true });
  assert.deepEqual(limiter.check("a", T0 + 3000), {
    allowed: false,
    scope: "client",
    retryAfterSeconds: 57,
  });
});

test("期間が過ぎると、また許可する", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 2, windowMs: MINUTE }],
    global: [],
  });

  limiter.check("a", T0);
  limiter.check("a", T0 + 10_000);
  assert.equal(limiter.check("a", T0 + 59_999).allowed, false);
  // 最初の1回が期間から外れた時点で、1回分だけ空く
  assert.equal(limiter.check("a", T0 + MINUTE).allowed, true);
  assert.equal(limiter.check("a", T0 + MINUTE + 1).allowed, false);
  assert.equal(limiter.check("a", T0 + MINUTE + 10_000).allowed, true);
});

test("拒否した呼び出しは回数に数えない", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 1, windowMs: MINUTE }],
    global: [],
  });

  limiter.check("a", T0);
  for (let i = 1; i <= 50; i += 1) {
    assert.equal(limiter.check("a", T0 + i * 1000).allowed, false);
  }
  assert.equal(limiter.check("a", T0 + MINUTE).allowed, true);
});

test("送信元ごとに別々に数える", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 1, windowMs: MINUTE }],
    global: [],
  });

  assert.equal(limiter.check("a", T0).allowed, true);
  assert.equal(limiter.check("b", T0).allowed, true);
  assert.equal(limiter.check("a", T0 + 1).allowed, false);
  assert.equal(limiter.check("b", T0 + 1).allowed, false);
});

test("送信元を変えても、全体の上限は超えられない", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 5, windowMs: MINUTE }],
    global: [{ limit: 10, windowMs: MINUTE }],
  });

  let allowed = 0;
  let lastDenied = null;
  for (let i = 0; i < 100; i += 1) {
    const decision = limiter.check(`client-${i}`, T0 + i);
    if (decision.allowed) allowed += 1;
    else lastDenied = decision;
  }

  assert.equal(allowed, 10);
  assert.equal(lastDenied.scope, "global");
  // 全体の上限で断った送信元は覚えておかない
  assert.equal(limiter.clientCount(), 10);
});

test("分の上限と日の上限を同時にかける", () => {
  const limiter = createRateLimiter({
    perClient: [
      { limit: 2, windowMs: MINUTE },
      { limit: 3, windowMs: DAY },
    ],
    global: [],
  });

  assert.equal(limiter.check("a", T0).allowed, true);
  assert.equal(limiter.check("a", T0 + 1).allowed, true);
  assert.equal(limiter.check("a", T0 + 2).allowed, false);
  assert.equal(limiter.check("a", T0 + 2 * MINUTE).allowed, true);

  const denied = limiter.check("a", T0 + 4 * MINUTE);
  assert.equal(denied.allowed, false);
  // 日の上限に当たっているので、待ち時間は1分より長い
  assert.ok(denied.retryAfterSeconds > 23 * 60 * 60);

  assert.equal(limiter.check("a", T0 + DAY).allowed, true);
});

test("覚えておく送信元の数に上限がある", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 1, windowMs: MINUTE }],
    global: [],
    maxClients: 100,
  });

  for (let i = 0; i < 1000; i += 1) {
    limiter.check(`client-${i}`, T0 + i);
  }
  assert.ok(limiter.clientCount() <= 100);

  // 期間が過ぎた送信元は、次の整理で忘れる
  for (let i = 0; i < 101; i += 1) {
    limiter.check(`later-${i}`, T0 + 2 * MINUTE + i);
  }
  assert.ok(limiter.clientCount() <= 100);
});

test("送信元がわからない呼び出しは、まとめて1つとして数える", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 1, windowMs: MINUTE }],
    global: [],
  });

  assert.equal(limiter.check("", T0).allowed, true);
  assert.equal(limiter.check("unknown", T0 + 1).allowed, false);
});

test("上限が0なら常に拒否する", () => {
  const limiter = createRateLimiter({
    perClient: [{ limit: 0, windowMs: MINUTE }],
    global: [],
  });

  const decision = limiter.check("a", T0);
  assert.equal(decision.allowed, false);
  assert.equal(decision.retryAfterSeconds, 60);
});
