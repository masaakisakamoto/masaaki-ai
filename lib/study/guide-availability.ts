/**
 * AIガイドの一時停止のスイッチ。
 *
 * 環境変数 SPORTS_GUIDE_ENABLED が "true"（または "1"）のときだけ、AIガイドを動かす。
 * 設定がなければ止まる。意図して有効にしたときだけ、OpenAI の費用がかかるようにするため。
 *
 * 再開するには、ホスティング先（Vercel など）の環境変数に SPORTS_GUIDE_ENABLED=true を
 * 設定して、デプロイし直す。手元で試すときは .env.local に同じ行を書く。
 */

export const SPORTS_GUIDE_PAUSED_MESSAGE =
  "ただいま、一時的に利用を停止しています。ご利用を希望される場合は、管理者にお問い合わせください。";

/** サーバー側だけで呼ぶ。ブラウザ側では環境変数を読めないので、常に false になる。 */
export function isSportsGuideEnabled(): boolean {
  const value = (process.env.SPORTS_GUIDE_ENABLED ?? "").trim().toLowerCase();
  return value === "true" || value === "1";
}
