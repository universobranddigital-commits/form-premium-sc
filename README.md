# Premium Clube — LP de cotação

Página de captura com qualificação por prazo e participação na decisão.

## Desenvolvimento

```bash
npm install
npm run dev
```

A API da Vercel encaminha as solicitações ao backend da versão original, que armazena os leads. O endereço fica em `lib/backend.ts`. As páginas de obrigado permanecem nesta aplicação. Configure `META_PIXEL_ID` na Vercel quando o ID da campanha estiver disponível; o evento `Lead` é emitido só na página qualificada.
