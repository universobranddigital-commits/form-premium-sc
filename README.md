# Premium Clube — LP de cotação

Página de captura com qualificação por prazo e participação na decisão.

## Desenvolvimento

```bash
npm install
npm run dev
```

A API da Vercel encaminha as solicitações ao backend da versão original, que armazena os leads. O endereço fica em `lib/backend.ts`. As páginas de obrigado permanecem nesta aplicação. Configure `META_PIXEL_ID` na Vercel quando o ID da campanha estiver disponível; o evento `Lead` é emitido só na página qualificada.

Para enviar cada lead ao Make, cadastre `MAKE_WEBHOOK_URL` nas variáveis de ambiente do projeto na Vercel, com escopo Production, e faça um novo deploy. O webhook recebe os campos do formulário, UTMs, `qualified` (booleano), `lead_id` e `created_at`. O endereço deve permanecer fora do repositório. Se o Make ficar indisponível, o lead continua salvo na base original e o visitante não precisa repetir o cadastro.
