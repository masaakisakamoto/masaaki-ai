import { NextResponse } from "next/server";

import {
  sportsPublicIntro,
  sportsAudienceNavigation,
  sportsCityApplications,
  sportsPrograms,
} from "@/data/study/content";

export async function POST(req: Request) {
  const { message } = await req.json();

  const context = `
あなたは深谷市スポーツ推進のガイドです。

以下の情報のみをもとに回答してください。

[概要]
${sportsPublicIntro.description}

[対象別]
${sportsAudienceNavigation.map((i) => `${i.title}: ${i.description}`).join("\n")}

[市での活用]
${sportsCityApplications.map((i) => `${i.title}: ${i.description}`).join("\n")}

[プログラム]
${sportsPrograms
      .map(
        (p) =>
          `${p.title}: ${p.purpose} / 対象: ${p.target} / 内容: ${p.structure.join(", ")}`
      )
      .join("\n")}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();

  console.log("OPENAI RESPONSE:", data);

  if (!data.choices) {
    return NextResponse.json({
      reply: "APIエラーが発生しています。コンソールを確認してください。",
    });
  }

  return NextResponse.json({
    reply: data.choices[0].message.content,
  });
}
