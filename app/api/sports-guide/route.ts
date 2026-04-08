import { NextResponse } from "next/server";

import {
  sportsPublicIntro,
  sportsAudienceNavigation,
  sportsCityApplications,
  sportsPrograms,
} from "@/data/study/content";
import { getRecentFeedbackSummary } from "@/lib/study/feedback";
import { routeAudience } from "@/lib/study/audience";
import {
  isStructuredAnswer,
  type StructuredAnswer,
} from "@/lib/study/types";

export const runtime = "nodejs";

function buildFallbackAnswer(message: string): StructuredAnswer {
  return {
    title: "回答を構造化できませんでした",
    summary:
      "現在の回答生成では構造化に失敗したため、質問を少し具体化して再度お試しください。",
    coreUnderstanding: `質問「${message}」に対して、現時点では安定した構造化応答を返せませんでした。`,
    evidenceBasis:
      "モデル出力が想定したJSON形式にならなかったため、構造化済みの回答としては採用していません。",
    practice: [
      "質問を短くして再度聞く",
      "対象を明確にする（市民向け・学校向け・行政向け）",
      "活用したい場面を一文足す",
    ],
    audienceViews: {
      citizen:
        "市民向けには、日常生活や地域活動にどう役立つかを含めて聞くと精度が上がります。",
      school:
        "学校向けには、授業・部活動・健康教育のどれに関する質問かを明記すると答えやすくなります。",
      government:
        "行政向けには、対象人口・施策目的・地域課題を含めると社会実装に結びつきやすくなります。",
    },
    nextAction:
      "質問対象と活用場面を一文追加して、もう一度質問してください。",
    confidenceNote:
      "この回答はフォールバックです。構造化出力には失敗しています。",
  };
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const userMessage = String(message ?? "").trim();
    const feedback = await getRecentFeedbackSummary(8);
    const audienceRouting = routeAudience(userMessage);

    if (!userMessage) {
      return NextResponse.json(
        {
          structured: buildFallbackAnswer(""),
          raw: "質問が空です。",
        },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `
あなたは masaaki.ai のスポーツ知識ガイドです。

あなたの役割は、単なる自由文の回答ではなく、
「理解 → 根拠 → 実践 → 社会への翻訳」
として知識を構造化することです。

以下の情報だけを根拠に、わかりやすく回答してください。
情報にないことは、推測しすぎず、その旨を confidenceNote に簡潔に書いてください。

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

[最近のフィードバック]
${feedback.summaryText || "まだフィードバックはありません。"}

[今回の回答の重心]
- 主軸: ${audienceRouting.primary}
- 副軸: ${audienceRouting.secondary.join(", ")}
- 理由: ${audienceRouting.reason}

出力ルール:
- 必ず JSON のみを返す
- 日本語で書く
- 「市民」「学校」「行政」を必ず含める
- 3視点すべては含めるが、主軸 audience を最も厚く具体的に書く
- 主軸 audience では、実行場面・対象・使い方を一段具体的にする
- 副軸 audience は簡潔でもよいが、省略しない
- practice は 2〜5 個の具体的アクションにする
- 情報にないことは断定しすぎない
- title, summary, coreUnderstanding, evidenceBasis, practice, audienceViews, nextAction, confidenceNote を必ず含める

返却形式:
{
  "title": "string",
  "summary": "string",
  "coreUnderstanding": "string",
  "evidenceBasis": "string",
  "practice": ["string"],
  "audienceViews": {
    "citizen": "string",
    "school": "string",
    "government": "string"
  },
  "nextAction": "string",
  "confidenceNote": "string"
}
            `.trim(),
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content ?? "";

    let parsed: StructuredAnswer | null = null;

    try {
      const json = JSON.parse(text);
      if (isStructuredAnswer(json)) {
        parsed = json;
      }
    } catch {
      parsed = null;
    }

    const structured = parsed ?? buildFallbackAnswer(userMessage);

    return NextResponse.json({
      structured,
      raw: text,
    });
  } catch (e) {
    console.error("[api/sports-guide] error", e);

    return NextResponse.json({
      structured: buildFallbackAnswer(""),
      raw: "サーバーエラー",
    });
  }
}
