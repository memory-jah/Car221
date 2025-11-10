import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.post('/wave', (req, res) => {
  res.json({ ok: true });
});

export default router;