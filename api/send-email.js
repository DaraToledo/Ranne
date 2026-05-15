/**
 * Ranne Care — Envio de e-mail ao colaborador
 * Vercel Serverless Function: /api/send-email
 * Usa Resend (resend.com) para envio
 */

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = [
    'https://rannecare.com.br',
    'https://www.rannecare.com.br',
    'https://ranne.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  // ── Validação ─────────────────────────────────────────────────────────────
  const { to, nome, login, senha, link } = req.body || {};
  if (!to || !senha) {
    return res.status(400).json({ error: 'Campos obrigatórios: to, senha' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY não configurada' });
  }

  // ── Template do e-mail ────────────────────────────────────────────────────
  const nomeExibido = nome || to.split('@')[0];
  const linkPlataforma = link || 'https://rannecare.com.br/empresa.html';

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acesso à Ranne Care</title>
</head>
<body style="margin:0;padding:0;background:#F0EDE6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0EDE6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

          <!-- Header verde -->
          <tr>
            <td style="background:#2D5E4A;padding:32px 40px;text-align:center;">
              <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#ffffff;letter-spacing:.06em;">
                RANNE <span style="color:#C9A84C;">CARE</span>
              </div>
              <div style="font-size:12px;color:rgba(255,255,255,.6);letter-spacing:.2em;text-transform:uppercase;margin-top:4px;">
                Saúde Organizacional
              </div>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="font-size:16px;color:#1A2E20;font-weight:600;margin:0 0 8px;">
                Olá, ${nomeExibido}! 👋
              </p>
              <p style="font-size:14px;color:#5a5248;line-height:1.7;margin:0 0 24px;">
                Sua empresa acabou de criar seu acesso à plataforma <strong>Ranne Care</strong> — a plataforma de saúde organizacional e bem-estar corporativo.
              </p>

              <!-- Credenciais -->
              <div style="background:#F7F4EE;border:1px solid rgba(45,94,74,.15);border-radius:12px;padding:20px 24px;margin-bottom:28px;">
                <p style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4A7A6E;margin:0 0 14px;">
                  Suas credenciais de acesso
                </p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="font-size:13px;color:#5a5248;padding:6px 0;">Login (e-mail)</td>
                    <td style="font-size:13px;color:#1A2E20;font-weight:600;text-align:right;">${login || to}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="border-top:1px solid rgba(45,94,74,.1);padding-top:6px;"></td>
                  </tr>
                  <tr>
                    <td style="font-size:13px;color:#5a5248;padding:6px 0;">Senha</td>
                    <td style="font-size:13px;color:#1A2E20;font-weight:600;text-align:right;font-family:monospace;letter-spacing:.08em;">${senha}</td>
                  </tr>
                </table>
              </div>

              <!-- Botão -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${linkPlataforma}"
                   style="display:inline-block;background:#2D5E4A;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 32px;border-radius:10px;letter-spacing:.04em;">
                  Acessar a plataforma →
                </a>
              </div>

              <p style="font-size:12px;color:#8a8278;line-height:1.7;margin:0;">
                Recomendamos que você altere sua senha após o primeiro acesso. Se tiver dúvidas, entre em contato com o RH da sua empresa ou fale com nossa assistente Ranne diretamente na plataforma.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F0EDE6;padding:20px 40px;text-align:center;border-top:1px solid rgba(45,94,74,.1);">
              <p style="font-size:11px;color:#9a9088;margin:0;line-height:1.6;">
                Ranne Care · São Paulo, SP<br>
                A Ranne Care é uma plataforma de tecnologia para gestão de saúde organizacional.<br>
                Não oferece atendimento clínico ou psicoterapia individual.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // ── Envio via Resend ──────────────────────────────────────────────────────
  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Ranne Care <noreply@rannecare.com.br>',
        to: [to],
        subject: `${nomeExibido}, seu acesso à Ranne Care está pronto`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('Resend error:', resendRes.status, err);
      return res.status(502).json({ error: 'Erro ao enviar e-mail' });
    }

    const data = await resendRes.json();
    return res.status(200).json({ ok: true, id: data.id });

  } catch (err) {
    console.error('Erro no send-email:', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
