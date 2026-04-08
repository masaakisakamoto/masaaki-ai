import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    return NextResponse.json({
      reply: `受け取った質問: ${message}`,
    });
  } catch {
    return NextResponse.json({
      reply: "エラーが発生しました",
    });
  }
}
