import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

/**
 * Start/submit KYC (simple JSON for now)
 * body: { user_id, id_type: "cni"|"permis", id_number, photo_url }
 */
router.post('/submit', (req, res) => {
  const { user_id, id_type, id_number, photo_url } = req.body || {};
  if (!user_id || !id_type || !id_number) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  const user = db.users.find(u => u.id === user_id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });

  user.kyc = {
    id_type,
    id_number,
    photo_url: photo_url || null,
    submitted_at: new Date().toISOString()
  };
  user.kyc_status = 'pending';
  return res.json({ status: user.kyc_status, kyc: user.kyc });
});

/** Get KYC status for a user */
router.get('/status', (req, res) => {
  const { user_id } = req.query;
  const user = db.users.find(u => u.id === user_id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });
  res.json({ status: user.kyc_status || 'none', kyc: user.kyc || null });
});

/** TEMP admin verify endpoint (for demo) */
router.post('/admin/verify', (req, res) => {
  const { user_id, decision } = req.body || {};
  const user = db.users.find(u => u.id === user_id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });

  user.kyc_status = decision === 'rejected' ? 'rejected' : 'verified';
  res.json({ status: user.kyc_status });
});

export default router;