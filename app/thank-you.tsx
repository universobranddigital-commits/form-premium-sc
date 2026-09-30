import Image from "next/image";
export function ThankYou({ title, message, extra }: { title: string; message: string; extra?: React.ReactNode }) {
  return <main className="thanks"><div className="thanks-card"><Image src="/premium-logo.webp" alt="Premium Clube" width={220} height={50} priority /><div className="thanks-check">✓</div><h1>{title}</h1><p>{message}</p><p className="thanks-note">Fique de olho no seu WhatsApp para o retorno do consultor.</p>{extra}</div></main>;
}
