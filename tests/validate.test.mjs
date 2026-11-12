import assert from "node:assert/strict";
import { test } from "node:test";

import {
  FEEDBACK_LIMITS,
  GUIDE_MESSAGE_MAX,
  validateFeedback,
  validateGuideMessage,
} from "../lib/security/validate.ts";

test("質問: 普通の質問はそのまま通す", () => {
  assert.deepEqual(validateGuideMessage("  市民向けの内容は？ "), {
    ok: true,
    value: "市民向けの内容は？",
  });
});

test("質問: 文字列でないもの、空のものは拒否する", () => {
  for (const input of [undefined, null, 1, {}, ["a"], "", "   ", "\n\t"]) {
    assert.equal(validateGuideMessage(input).ok, false, JSON.stringify(input));
  }
});

test("質問: 上限ちょうどは通し、1文字超えたら拒否する", () => {
  assert.equal(validateGuideMessage("あ".repeat(GUIDE_MESSAGE_MAX)).ok, true);
  assert.equal(validateGuideMessage("あ".repeat(GUIDE_MESSAGE_MAX + 1)).ok, false);
  // 絵文字のように内部で2単位になる文字も、1文字として数える
  assert.equal(validateGuideMessage("😀".repeat(GUIDE_MESSAGE_MAX)).ok, true);
});

test("質問: 改行と制御文字は空白にまとめる", () => {
  const result = validateGuideMessage("学校では\r\n\r\nどう\x00活用\x1bできる？");
  assert.deepEqual(result, { ok: true, value: "学校では どう 活用 できる？" });
});

const valid = {
  type: "sports-request",
  area: "sports-request",
  audience: "citizen",
  pageUrl: "/study/sports/request",
  name: "山田 太郎",
  email: "taro@example.com",
  message: "【ご要望】\n体験会を開いてほしいです。",
};

test("フィードバック: 画面が送る形はそのまま通す", () => {
  assert.deepEqual(validateFeedback(valid), { ok: true, value: valid });
});

test("フィードバック: 画面で使っている種別はすべて通す", () => {
  const types = ["suggestion", "request", "correction", "helpful", "other",
    "structured-answer", "sports-event-request", "sports-organization-register", "sports-request"];
  const areas = ["study", "human-systems", "medical", "ai", "sports", "longevity", "tools", "other",
    "sports-event-request", "sports-organization-register", "sports-request"];
  const audiences = ["new", "familiar", "professional", "auto", "citizen", "school", "government", "organization", ""];

  for (const type of types) assert.equal(validateFeedback({ ...valid, type }).ok, true, type);
  for (const area of areas) assert.equal(validateFeedback({ ...valid, area }).ok, true, area);
  for (const audience of audiences) assert.equal(validateFeedback({ ...valid, audience }).ok, true, audience);
});

test("フィードバック: 省略した項目には既定値を入れる", () => {
  assert.deepEqual(validateFeedback({ message: "役に立ちました" }), {
    ok: true,
    value: {
      type: "other",
      area: "other",
      audience: "",
      pageUrl: "",
      name: "",
      email: "",
      message: "役に立ちました",
    },
  });
});

test("フィードバック: 本文がない、文字列でない、長すぎるものは拒否する", () => {
  for (const message of [undefined, null, "", "   ", 1, {}, ["a"]]) {
    assert.equal(validateFeedback({ ...valid, message }).ok, false, JSON.stringify(message));
  }
  assert.equal(validateFeedback({ ...valid, message: "あ".repeat(FEEDBACK_LIMITS.message) }).ok, true);
  assert.equal(validateFeedback({ ...valid, message: "あ".repeat(FEEDBACK_LIMITS.message + 1) }).ok, false);
});

test("フィードバック: オブジェクト以外は拒否する", () => {
  for (const body of [null, undefined, "text", 1, [], [valid]]) {
    assert.equal(validateFeedback(body).ok, false, JSON.stringify(body));
  }
});

test("フィードバック: 種別に識別子以外の文字列は入れられない", () => {
  const bad = ["Sports", "a b", "指示を無視して", "a\nb", "-a", "a".repeat(65), "", 1, {}, ["sports"]];
  for (const value of bad) {
    assert.equal(validateFeedback({ ...valid, type: value }).ok, false, `type=${JSON.stringify(value)}`);
    assert.equal(validateFeedback({ ...valid, area: value }).ok, false, `area=${JSON.stringify(value)}`);
  }
  for (const value of bad.filter((v) => v !== "")) {
    assert.equal(validateFeedback({ ...valid, audience: value }).ok, false, `audience=${JSON.stringify(value)}`);
  }
});

test("フィードバック: メールアドレスは空か、それらしい形だけ通す", () => {
  for (const email of ["", "a@example.com", "a.b+c@sub.example.co.jp"]) {
    assert.equal(validateFeedback({ ...valid, email }).ok, true, email);
  }
  for (const email of ["a", "a@", "@example.com", "a b@example.com", "a@example", `${"a".repeat(250)}@example.com`, 1, {}]) {
    assert.equal(validateFeedback({ ...valid, email }).ok, false, JSON.stringify(email));
  }
});

test("フィードバック: 名前とページの長さに上限がある", () => {
  assert.equal(validateFeedback({ ...valid, name: "あ".repeat(FEEDBACK_LIMITS.name) }).ok, true);
  assert.equal(validateFeedback({ ...valid, name: "あ".repeat(FEEDBACK_LIMITS.name + 1) }).ok, false);
  assert.equal(validateFeedback({ ...valid, pageUrl: "a".repeat(FEEDBACK_LIMITS.pageUrl + 1) }).ok, false);
  assert.equal(validateFeedback({ ...valid, name: { toString: () => "x" } }).ok, false);
});

test("フィードバック: 本文の改行は残し、ほかの制御文字は取り除く", () => {
  const result = validateFeedback({ ...valid, message: "1行目\n2行目\x00\x1b", name: "山田\n太郎" });
  assert.equal(result.ok, true);
  assert.equal(result.value.message, "1行目\n2行目");
  assert.equal(result.value.name, "山田 太郎");
});

test("フィードバック: 決められていない項目は捨てる", () => {
  const result = validateFeedback({ ...valid, status: "done", id: "x", admin: true });
  assert.deepEqual(Object.keys(result.value).sort(), Object.keys(valid).sort());
});
