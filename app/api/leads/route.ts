import { NextResponse } from "next/server";
import { backendOrigin } from "../../../lib/backend";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    if (body.length > 12000) return NextResponse.json({ error: "Solicitação muito grande." }, { status: 413 });
    const response = await fetch(`${backendOrigin}/api/leads`, { method: "POST", headers: { "content-type": "application/json" }, body, cache: "no-store" });
    const data = await response.json() as { redirect?: string; error?: string; field?: string };
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    if (!data.redirect?.startsWith("/obrigado")) throw new Error("Unexpected redirect");
    return NextResponse.json({ redirect: data.redirect });
  } catch (error) {
    console.error("Lead forwarding failed", error);
    return NextResponse.json({ error: "Não conseguimos registrar sua solicitação agora. Tente novamente." }, { status: 503 });
  }
}
