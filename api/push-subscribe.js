import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { subscription, userId, empresaId } = req.body;
  if (!subscription || !userId || !empresaId)
    return res.status(400).json({ error: 'Dados incompletos' });

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { user_id: userId, empresa_id: empresaId, subscription },
      { onConflict: 'user_id' }
    );

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
