"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { decisions, situations, timings, vehicles } from "../lib/qualification";

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setBusy(true); setError("");
    const data = Object.fromEntries(new FormData(form).entries());
    const params = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) data[key] = params.get(key)?.slice(0, 160) || "";
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const result = await res.json() as { redirect?: string; error?: string; field?: string };
      if (!res.ok || !result.redirect) {
        if (result.field) (form.elements.namedItem(result.field) as HTMLElement | null)?.focus();
        throw new Error(result.error || "Não foi possível enviar. Tente novamente.");
      }
      window.location.assign(result.redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
      setBusy(false);
    }
  }
  return <main className="landing">
    <div className="wrap">
      <header className="topbar"><Image src="/premium-logo.webp" alt="Premium Clube" width={215} height={45} priority /><span>PROTEÇÃO VEICULAR</span></header>
      <div className="columns">
        <section className="pitch" aria-labelledby="headline">
          <div className="eyebrow"><span className="accent-line" /> COTAÇÃO PERSONALIZADA</div>
          <h1 id="headline">Seu veículo protegido. <em>Sua rotina mais tranquila.</em></h1>
          <p>Imprevistos acontecem. Conte como você usa seu veículo e um consultor Premium vai preparar uma cotação para o seu momento, sem compromisso.</p>
          <div className="trust"><span className="small-icon">✓</span><span>Atendimento direto com um consultor</span></div>
          <div className="trust"><span className="small-icon">✓</span><span>Opções para passeio, aplicativo, táxi e mais</span></div>
          <p className="microcopy">Preencha agora. Leva cerca de 1 minuto.</p>
        </section>
        <section className="card" aria-labelledby="form-heading">
          <div className="card-header"><div><span className="form-kicker">COMECE POR AQUI</span><h2 id="form-heading">Receba sua cotação</h2></div><span className="time">~ 1 min</span></div>
          <form onSubmit={submit}>
            <div className="row"><label>Seu nome<input name="name" autoComplete="name" placeholder="Nome e sobrenome" minLength={2} maxLength={100} required /></label><label>WhatsApp<input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="(71) 99999-9999" minLength={10} maxLength={20} required /></label></div>
            <div className="row"><label>Placa do veículo<input name="plate" placeholder="ABC1D23" autoCapitalize="characters" maxLength={8} required onInput={e => { e.currentTarget.value = e.currentTarget.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7); }} /></label><label>Tipo de veículo<select name="vehicle" required defaultValue=""><option value="" disabled>Selecione</option>{vehicles.map(v => <option key={v}>{v}</option>)}</select></label></div>
            <label>Situação atual do veículo<select name="situation" required defaultValue=""><option value="" disabled>Selecione</option>{situations.map(v => <option key={v}>{v}</option>)}</select></label>
            <div className="row"><label>Quando pretende fechar?<select name="timing" required defaultValue=""><option value="" disabled>Selecione</option>{timings.map(v => <option key={v}>{v}</option>)}</select></label><label>Você participa da decisão?<select name="decision" required defaultValue=""><option value="" disabled>Selecione</option>{decisions.map(v => <option key={v}>{v}</option>)}</select></label></div>
            <label className="consent"><input type="checkbox" name="consent" value="yes" required /><span>Autorizo o contato de um consultor Premium pelo WhatsApp ou telefone sobre esta cotação.</span></label>
            <div className="trap" aria-hidden="true"><label>Empresa<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
            {error && <p role="alert" className="error">{error}</p>}
            <button disabled={busy} type="submit">{busy ? "Enviando..." : "Quero receber minha cotação"}</button>
            <p className="fine">Seus dados serão usados para atender sua solicitação.</p>
          </form>
        </section>
      </div>
      <footer>Premium Clube • Proteção veicular</footer>
    </div>
  </main>;
}
