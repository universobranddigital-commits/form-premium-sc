"use client";
import { useEffect } from "react";
declare global { interface Window { fbq?: (...args: unknown[]) => void; _fbq?: unknown } }
export function QualifiedPixel({ pixelId, eventId }: { pixelId: string; eventId: string }) {
  useEffect(() => {
    if (!pixelId || !/^\d{8,25}$/.test(pixelId) || !eventId) return;
    const key = `premium-lead-${eventId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    if (!window.fbq) {
      const queue: unknown[][] = [];
      window.fbq = (...args: unknown[]) => { queue.push(args); };
      Object.assign(window.fbq, { queue, loaded: true, version: "2.0" });
      const script = document.createElement("script"); script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js"; document.head.appendChild(script);
    }
    window.fbq!("init", pixelId);
    window.fbq!("track", "Lead", { content_name: "Lead qualificado - proteção veicular" }, { eventID: eventId });
  }, [pixelId, eventId]);
  return null;
}
