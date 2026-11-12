/**
 * メモリ上の回数制限。外部のサービスも追加の依存も使わない。
 *
 * 限界: サーバーレス環境では、インスタンスごとに別々に数える。
 * インスタンスが増えたり入れ替わったりすると、ここでの上限は超えられる。
 * 費用の上限は、OpenAI 側の利用上限でも必ず設定すること（docs/api-guard.md）。
 */

export type RateLimitRule = {
  /** 期間内に許す回数 */
  limit: number;
  /** 期間（ミリ秒） */
  windowMs: number;
};

export type RateLimitDecision =
  | { allowed: true }
  | { allowed: false; scope: "client" | "global"; retryAfterSeconds: number };

export type RateLimiterOptions = {
  /** 送信元ごとの上限 */
  perClient: RateLimitRule[];
  /** 全体の上限。送信元を変えながらの大量アクセスに備える */
  global: RateLimitRule[];
  /** 覚えておく送信元の数の上限 */
  maxClients?: number;
};

export type RateLimiter = {
  /** 許可するなら1回分を記録する。拒否した呼び出しは回数に数えない。 */
  check(clientKey: string, now?: number): RateLimitDecision;
  clientCount(): number;
};

const DEFAULT_MAX_CLIENTS = 5000;

function longestWindow(rules: RateLimitRule[]): number {
  return rules.reduce((max, rule) => Math.max(max, rule.windowMs), 0);
}

function dropExpired(hits: number[], now: number, windowMs: number): void {
  let expired = 0;
  while (expired < hits.length && hits[expired] <= now - windowMs) {
    expired += 1;
  }
  if (expired > 0) hits.splice(0, expired);
}

/** 次に許可できるまでの秒数。今すぐ許可できるなら 0。 */
function secondsUntilAllowed(
  hits: number[],
  rule: RateLimitRule,
  now: number
): number {
  if (rule.limit <= 0) return Math.max(1, Math.ceil(rule.windowMs / 1000));

  let inWindow = 0;
  for (let i = hits.length - 1; i >= 0 && hits[i] > now - rule.windowMs; i -= 1) {
    inWindow += 1;
  }
  if (inWindow < rule.limit) return 0;

  // 新しいほうから数えて limit 番目の記録が期間から外れると、1回分の空きができる
  const blocking = hits[hits.length - rule.limit];
  return Math.max(1, Math.ceil((blocking + rule.windowMs - now) / 1000));
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const maxClients = options.maxClients ?? DEFAULT_MAX_CLIENTS;
  const clientWindow = longestWindow(options.perClient);
  const globalWindow = longestWindow(options.global);

  const clients = new Map<string, number[]>();
  const globalHits: number[] = [];

  function evict(now: number): void {
    for (const [key, hits] of clients) {
      dropExpired(hits, now, clientWindow);
      if (hits.length === 0) clients.delete(key);
    }
    // それでも多ければ、長く使われていない送信元から忘れる
    for (const key of clients.keys()) {
      if (clients.size <= maxClients) break;
      clients.delete(key);
    }
  }

  return {
    check(clientKey: string, now: number = Date.now()): RateLimitDecision {
      const key = clientKey || "unknown";
      const clientHits = clients.get(key) ?? [];

      dropExpired(clientHits, now, clientWindow);
      dropExpired(globalHits, now, globalWindow);

      let wait = 0;
      let scope: "client" | "global" = "client";

      for (const rule of options.perClient) {
        const seconds = secondsUntilAllowed(clientHits, rule, now);
        if (seconds > wait) {
          wait = seconds;
          scope = "client";
        }
      }
      for (const rule of options.global) {
        const seconds = secondsUntilAllowed(globalHits, rule, now);
        if (seconds > wait) {
          wait = seconds;
          scope = "global";
        }
      }

      if (wait > 0) {
        if (clientHits.length === 0) clients.delete(key);
        return { allowed: false, scope, retryAfterSeconds: wait };
      }

      clientHits.push(now);
      globalHits.push(now);

      // 最近使った送信元を後ろに並べ直す
      clients.delete(key);
      clients.set(key, clientHits);
      if (clients.size > maxClients) evict(now);

      return { allowed: true };
    },

    clientCount(): number {
      return clients.size;
    },
  };
}
