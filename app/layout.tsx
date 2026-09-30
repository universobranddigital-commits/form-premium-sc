import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Clube | Sua cotação de proteção veicular",
  description: "Peça uma cotação de proteção veicular com um consultor Premium Clube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
