import { NextResponse } from "next/server";

import {
  sportsPublicIntro,
  sportsAudienceNavigation,
  sportsCityApplications,
  sportsPrograms,
} from "@/data/study/content";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
あなたは深谷市のスポーツ推進ガイドです。

以下の情報だけを根拠に、わかりやすく回答してください。
情報にないことは、推測しすぎず、その旨を簡潔に伝えてください。

[このページについて]
${sportsPublicIntro.description}

[対象別ナビゲーション]
${sportsAudienceNavigation
  .map((item) => `${item.title}: ${item.description}`)
  .join("\n")}

[深谷市スポーツ推進で活かす視点]
${sportsCityApplications
  .map((item) => `${item.title}: ${item.description}`)
  .join("\n")}

[スポーツプログラム]
${sportsPrograms
  .map(
    (program) =>
      `${program.title}
対象: ${program.target}
目的: ${program.purpose}
内容: ${program.structure.join(" / ")}
時間: ${program.duration}
頻度: ${program.frequency}
期待される変化: ${program.expectedOutcome}
接続領域: ${program.connection.join(" / ")}`
  )
  .join("\n\n")}

回答方針:
- 「市民」「学校」「行政」のどの視点に近い質問かを意識する
- できるだけ具体的に答える
- 必要なら、このページのどの考え方やプログラムに近いかを示す
- 日本語で自然に答える
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content ?? "エラー",
    });
  } catch (e) {
    return NextResponse.json({
      reply: "サーバーエラー",
    });
  }
}
