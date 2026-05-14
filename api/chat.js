/**
 * Ranne Care — Proxy seguro para a API da Anthropic
 * Vercel Serverless Function: /api/chat
 *
 * A chave da API fica APENAS no servidor (variável de ambiente da Vercel),
 * nunca exposta no browser.
 */

export default async function handler(req, res) {
  // ── CORS — permitir chamadas do próprio domínio ──────────────────────────
  const allowedOrigins = [
    'https://ranne.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:5500', // Live Server local
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // ── Validação do body ────────────────────────────────────────────────────
  const { messages, system, context } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Campo messages é obrigatório' });
  }

  // Limitar histórico para 20 trocas (evitar abuso de tokens)
  const recentMessages = messages.slice(-20);

  // ── System prompts por contexto ──────────────────────────────────────────
  const SYSTEM_PROMPTS = {
    empresa: `Você é o Assistente Ranne, especialista em saúde organizacional e bem-estar no trabalho.
Você apoia gestores e profissionais de RH a interpretar dados de clima organizacional, identificar sinais de burnout e sobrecarga nas equipes, e criar planos de ação eficazes.
Diretrizes:
- Seja objetivo, empático e profissional
- Use dados e evidências quando possível
- Sugira ações concretas e práticas
- Lembre sempre que o app é uma ferramenta de apoio, não substitui avaliação clínica profissional
- Responda em português do Brasil
- Seja conciso (máx. 3 parágrafos por resposta)
- Nunca faça diagnósticos de saúde mental individuais`,

    colaborador: `Você é o Assistente Ranne, um apoio amigável de saúde mental e bem-estar no trabalho.
Você ajuda colaboradores a entender seus próprios sentimentos, lidar com estresse, burnout e sobrecarga, e adotar práticas de autocuidado no dia a dia.
Diretrizes:
- Seja caloroso, acolhedor e sem julgamentos
- Use linguagem simples e acessível
- Ofereça dicas práticas baseadas em evidências
- Valide os sentimentos da pessoa antes de dar sugestões
- Lembre sempre que você é um apoio, não substitui profissionais de saúde mental
- Se a pessoa demonstrar sofrimento intenso, encoraje buscar apoio profissional
- Responda em português do Brasil
- Seja conciso e humano (máx. 3 parágrafos)
- Nunca faça diagnósticos`,

    admin: `Você é o Assistente Ranne para a área administrativa da plataforma Ranne Care.
A plataforma Ranne Care é um SaaS B2B de saúde mental e bem-estar organizacional.
Você apoia a equipe administrativa a gerenciar clientes, analisar métricas de uso e saúde da plataforma, identificar riscos de churn e configurar o sistema.
Diretrizes:
- Seja objetivo, estratégico e direto
- Use linguagem profissional e de negócios
- Sugira ações concretas baseadas em dados
- Responda em português do Brasil
- Seja conciso (máx. 3 parágrafos por resposta)
- Quando relevante, mencione métricas como MRR, churn, NPS, DAU/MAU`,
  };

  const systemPrompt = system || SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.colaborador;

  // ── Rate limiting básico (por IP) ────────────────────────────────────────
  // Vercel não persiste estado entre invocações, então usamos headers para
  // detectar abusos óbvios. Para rate limiting real, usar Upstash Redis.
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  // ── Chamada para a API da Anthropic ─────────────────────────────────────
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY não configurada nas variáveis de ambiente');
    return res.status(500).json({ error: 'Configuração do servidor incompleta' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: recentMessages,
      }),
    });

    if (!anthropicRes.ok) {
      const errBody = await anthropicRes.text();
      console.error('Erro da API Anthropic:', anthropicRes.status, errBody);
      return res.status(502).json({ error: 'Erro ao comunicar com o serviço de IA' });
    }

    const data = await anthropicRes.json();
    const reply = data.content?.[0]?.text || 'Desculpe, não consegui processar sua mensagem.';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Erro no proxy de chat:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
