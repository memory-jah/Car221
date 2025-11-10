import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// LIST (optional filters)
router.get('/', (req, res) => {
  const { renter_id, vehicle_id } = req.query;
  let items = db.bookings;
  if (renter_id) items = items.filter(b => b.renter_id === renter_id);
  if (vehicle_id) items = items.filter(b => b.vehicle_id === vehicle_id);
  res.json({ bookings: items });
});

// GET one
router.get('/:id', (req, res) => {
  const b = db.bookings.find(x => x.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'not_found' });
  res.json(b);
});

// CREATE
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
    price_day_fcfa, deposit_fcfa, total_fcfa,
    status: 'awaiting_payment',
    created_at: new Date().toISOString()
  };

  db.bookings.push(booking);
  res.status(201).json(booking);
});

export default router;