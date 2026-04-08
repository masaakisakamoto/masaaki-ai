import { NextResponse } from "next/server";

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

以下の考え方をもとに回答してください。

・市民の運動習慣づくり
・学校での運動教育
・地域スポーツの活性化
・高齢者の健康づくり
・行動変容（続けられる仕組み）

回答は、できるだけ
「市民」「学校」「行政」のどの視点かを意識して、
わかりやすく具体的に説明してください。
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
