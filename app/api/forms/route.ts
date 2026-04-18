import { NextResponse } from "next/server";
import { submitForm } from "@/lib/blocks";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      form_type?: string;
      data?: Record<string, unknown>;
    };

    if (!body.form_type || !body.data) {
      return NextResponse.json({ error: "Missing form payload." }, { status: 400 });
    }

    await submitForm(body.form_type, body.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to submit form." }, { status: 500 });
  }
}
