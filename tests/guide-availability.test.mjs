import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import {
  isSportsGuideEnabled,
  SPORTS_GUIDE_PAUSED_MESSAGE,
} from "../lib/study/guide-availability.ts";

const original = process.env.SPORTS_GUIDE_ENABLED;

afterEach(() => {
  if (original === undefined) delete process.env.SPORTS_GUIDE_ENABLED;
  else process.env.SPORTS_GUIDE_ENABLED = original;
});

test("設定がなければ、AIガイドは止まっている", () => {
  delete process.env.SPORTS_GUIDE_ENABLED;
  assert.equal(isSportsGuideEnabled(), false);
});

test("true か 1 を設定したときだけ動く", () => {
  for (const value of ["true", "TRUE", " true ", "1"]) {
    process.env.SPORTS_GUIDE_ENABLED = value;
    assert.equal(isSportsGuideEnabled(), true, JSON.stringify(value));
  }
});

test("それ以外の値では止まったまま", () => {
  for (const value of ["", "false", "0", "no", "off", "yes", "on", "enabled", "truee"]) {
    process.env.SPORTS_GUIDE_ENABLED = value;
    assert.equal(isSportsGuideEnabled(), false, JSON.stringify(value));
  }
});

test("停止中の案内文がある", () => {
  assert.match(SPORTS_GUIDE_PAUSED_MESSAGE, /一時的に利用を停止/);
  assert.match(SPORTS_GUIDE_PAUSED_MESSAGE, /管理者にお問い合わせください/);
});
