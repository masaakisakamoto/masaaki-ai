import { NextResponse } from "next/server";

export async function POST(req: Request) {
  return NextResponse.json({
    reply: "APIは正常に動いています",
  });
}
