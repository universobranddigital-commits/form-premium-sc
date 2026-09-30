import { redirect } from "next/navigation";
import { ThankYou } from "../thank-you";
import { QualifiedPixel } from "./pixel";
import { backendOrigin } from "../../lib/backend";

export const dynamic = "force-dynamic";
export default async function QualifiedPage({ searchParams }: { searchParams: Promise<{ id?: string; preview?: string }> }) {
  const { id, preview } = await searchParams;
  const thankYou = <ThankYou title="Recebemos seu pedido!" message="Um consultor Premium vai analisar as informações do veículo e entrar em contato com uma cotação personalizada." />;
  if (preview === "1") return thankYou;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) redirect("/");
  const response = await fetch(`${backendOrigin}/api/leads/verify?id=${encodeURIComponent(id)}`, { cache: "no-store" });
  if (!response.ok) redirect("/");
  const result = await response.json() as { qualified?: boolean };
  if (!result.qualified) redirect("/");
  const pixelId = process.env.META_PIXEL_ID || "";
  return <>{thankYou}<QualifiedPixel pixelId={pixelId} eventId={id} /></>;
}
