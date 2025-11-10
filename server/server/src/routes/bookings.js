import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.post('/', (req, res) => {
  const {
    vehicle_id, renter_id,
    start_date, end_date,
    price_day_fcfa, deposit_fcfa, total_fcfa
  } = req.body;

  const booking = {
    id: String(Date.now()),
    vehicle_id, renter_id,
    start_date, end_date,
    price_day_fcfa,
    deposit_fcfa,
    total_fcfa,
    status: 'awaiting_payment'
  };

  db.bookings.push(booking);
  res.status(201).json(booking);
});

export default router;