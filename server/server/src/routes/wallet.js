import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

function ensureWallet(u) {
  if (!u.wallet) u.wallet = { balance_fcfa: 0 };
  if (!db.transactions) db.transactions = [];
}

/** GET /api/wallet/balance?user_id=... */
router.get('/balance', (req, res) => {
  const { user_id } = req.query;
  const user = db.users.find(u => u.id === user_id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });
  ensureWallet(user);
  res.json({ balance_fcfa: user.wallet.balance_fcfa });
});

/** GET /api/wallet/transactions?user_id=... */
router.get('/transactions', (req, res) => {
  const { user_id } = req.query;
  const user = db.users.find(u => u.id === user_id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });
  ensureWallet(user);
  const tx = (db.transactions || []).filter(t => t.user_id === user_id).sort((a,b) => b.ts.localeCompare(a.ts));
  res.json({ transactions: tx });
});

/**
 * POST /api/wallet/withdraw
 * body: { user_id, amount_fcfa, dest: "wave_visa", card_last4 }
 * fee: 6% -> host receives amount*0.94
 */
router.post('/withdraw', (req, res) => {
  const { user_id, amount_fcfa, dest, card_last4 } = req.body || {};
  if (!user_id || !amount_fcfa || amount_fcfa <= 0) {
    return res.status(400).json({ error: 'invalid_amount' });
  }
  const user = db.users.find(u => u.id === user_id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });

  ensureWallet(user);

  const amt = Number(amount_fcfa);
  if (user.wallet.balance_fcfa < amt) {
    return res.status(400).json({ error: 'insufficient_balance' });
  }

  const FEE_RATE = 0.06;
  const fee = Math.round(amt * FEE_RATE);
  const payout = amt - fee;

  // Deduct immediately (simulate synchronous payout)
  user.wallet.balance_fcfa -= amt;

  const now = new Date().toISOString();
  db.transactions.push({
    id: 'tx_' + Date.now(),
    user_id,
    type: 'debit_withdrawal',
    method: dest || 'wave_visa',
    card_last4: card_last4 || null,
    amount_fcfa: amt,
    fee_fcfa: fee,
    payout_fcfa: payout,
    ts: now,
    meta: { status: 'processed' }
  });

  res.status(201).json({
    ok: true,
    new_balance_fcfa: user.wallet.balance_fcfa,
    fee_fcfa: fee,
    payout_fcfa: payout
  });
});

export default router;