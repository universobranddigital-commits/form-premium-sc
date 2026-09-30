import { NextResponse } from "next/server";
import { backendOrigin } from "../../../lib/backend";
import { qualifies } from "../../../lib/qualification";

type Lead = Record<string, unknown>;

function field(lead: Lead, key: string) {
  return typeof lead[key] === "string" ? lead[key] : "";
}

export async function POST(request: Request) {
  try {
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    const body = await request.text();
    if (body.length > 12000) return NextResponse.json({ error: "Solicitação muito grande." }, { status: 413 });
    const lead = JSON.parse(body) as Lead;
    if (!lead || typeof lead !== "object" || Array.isArray(lead)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }
    const response = await fetch(`${backendOrigin}/api/leads`, { method: "POST", headers: { "content-type": "application/json" }, body, cache: "no-store" });
    const data = await response.json() as { redirect?: string; error?: string; field?: string };
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    if (!data.redirect?.startsWith("/obrigado")) throw new Error("Unexpected redirect");

    const leadId = new URL(data.redirect, backendOrigin).searchParams.get("id") || "";
    const qualified = qualifies(field(lead, "timing"), field(lead, "decision"));
    if (webhookUrl) try {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          created_at: new Date().toISOString(),
          source: "LP Premium Clube - Vercel",
          qualified,
          name: field(lead, "name"),
          whatsapp: field(lead, "whatsapp"),
          plate: field(lead, "plate"),
          vehicle: field(lead, "vehicle"),
          situation: field(lead, "situation"),
          timing: field(lead, "timing"),
          decision: field(lead, "decision"),
          consent: field(lead, "consent"),
          utm_source: field(lead, "utm_source"),
          utm_medium: field(lead, "utm_medium"),
          utm_campaign: field(lead, "utm_campaign"),
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!webhookResponse.ok) console.error("Make webhook rejected a saved lead", { status: webhookResponse.status, leadId });
    } catch (error) {
      // The lead is already saved. Do not ask the visitor to retry and create a duplicate.
      console.error("Make webhook failed for a saved lead", { leadId, error });
    }
    return NextResponse.json({ redirect: data.redirect });
  } catch (error) {
    console.error("Lead forwarding failed", error);
    return NextResponse.json({ error: "Não conseguimos registrar sua solicitação agora. Tente novamente." }, { status: 503 });
  }
}
