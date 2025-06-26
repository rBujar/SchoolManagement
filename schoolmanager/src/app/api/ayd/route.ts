import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { url } = await fetch("https://www.askyourdatabase.com/api/chatbot/v2/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer dc7e637800a7c9048951be9f1d5f6d026c0d4bff0543681844b3605301d35e9b", // Replace with your actual API key
    },
    body: JSON.stringify({
      "chatbotid": "e9f24d547af51fdf52b7a60b9d05f4ee",
      "name": "Bujar",
      "email": "rokabujar@gmail.com"
    }),
  }).then((res) => res.json());

  return NextResponse.json({ url });
}
