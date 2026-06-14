import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

webpush.setVapidDetails(
  process.env.VAPID_MAILTO,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.WEBHOOK_SECRET)
    return res.status(401).json({ error: 'Não autorizado' });

  const record = req.body.record || req.body;
  const empresaId = record.empresa_id;
  const testeId = record.teste_id || 'novo diagnóstico';

  if (!empresaId) return res.status(400).json({ error: 'empresa_id obrigatório' });

  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('empresa_id', empresaId);

  if (error) return res.status(500).json({ error: error.message });
  if (!subs?.length) return res.status(200).json({ sent: 0 });

  const payload = JSON.stringify({
    title: 'Novo diagnóstico disponível',
    body: `O RH enviou um novo teste para você responder: ${testeId.replace('_ranne','').replace('_',' ')}.`,
    icon: '/icons/launchericon-192x192.png',
    badge: '/icons/launchericon-192x192.png',
    data: { url: '/app' }
  });

  const results = await Promise.allSettled(
    subs.map(({ subscription }) =>
      webpush.sendNotification(subscription, payload)
    )
  );

  const sent = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  return res.status(200).json({ sent, failed });
}
