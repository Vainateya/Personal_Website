import { NextResponse } from "next/server";
import { submitFormResponse } from "@/lib/blocks";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      block_id?: string;
      data?: Record<string, unknown>;
    };

    if (!body.block_id || !body.data) {
      return NextResponse.json({ error: "Missing block_id or data." }, { status: 400 });
    }

    await submitFormResponse(body.block_id, body.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to submit form." }, { status: 500 });
  }
}
