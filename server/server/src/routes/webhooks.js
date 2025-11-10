import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

/**
 * Helper: make sure wallet/transactions exist
 */
function ensureWallet(user) {
  if (!user.wallet) user.wallet = { balance_fcfa: 0 };
  if (!db.transactions) db.transactions = [];
}

/**
 * Wave webhook (MVP)
 * Expect a JSON body that includes at least:
 * - event: "payment_success" | "payment_failed" | ...
 * - booking_id: string
 * - amount_fcfa: number (optional; we fall back to booking.total_fcfa)
 * - tx_id: string (optional external reference)
 *
 * NOTE: In production you should VERIFY a signature header from Wave.
 */
router.post('/wave', (req, res) => {
  try {
    const body = req.body || {};
    const { event, status, booking_id, amount_fcfa, tx_id } = body;

    // Only react to success events
    const isSuccess = event === 'payment_success' || status === 'success';
    if (!isSuccess) {
      return res.status(200).json({ ok: true, ignored: true });
    }

    if (!booking_id) {
      return res.status(400).json({ error: 'missing_booking_id' });
    }

    // Find booking
    const booking = db.bookings.find(b => b.id === String(booking_id));
    if (!booking) {
      return res.status(404).json({ error: 'booking_not_found' });
    }

    // Idempotency: if already paid, do nothing
    if (booking.status === 'paid') {
      return res.status(200).json({ ok: true, already_paid: true });
    }

    // Mark booking as PAID
    const paidAmount = Number(amount_fcfa || booking.total_fcfa || 0);
    booking.status = 'paid';
    booking.paid_at = new Date().toISOString();
    booking.paid_amount_fcfa = paidAmount;
    if (tx_id) booking.payment_ref = tx_id;

    // Credit the HOST (vehicle owner)
    const vehicle = db.vehicles.find(v => v.id === booking.vehicle_id);
    if (vehicle && vehicle.owner_id) {
      const host = db.users.find(u => u.id === vehicle.owner_id);
      if (host) {
        ensureWallet(host);
        host.wallet.balance_fcfa += paidAmount;

        db.transactions.push({
          id: 'tx_' + Date.now(),
          user_id: host.id,
          type: 'credit_booking',
          amount_fcfa: paidAmount,
          fee_fcfa: 0,
          payout_fcfa: 0,
          ts: new Date().toISOString(),
          meta: {
            booking_id: booking.id,
            vehicle_id: booking.vehicle_id,
            payment_ref: tx_id || null,
            source: 'wave'
          }
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'webhook_error' });
  }
});

export default router;