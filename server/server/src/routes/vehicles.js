import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ vehicles: db.vehicles });
});

export default router;