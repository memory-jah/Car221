import { Router } from 'express';

const router = Router();

router.post('/wave/checkout', (req, res) => {
  const { booking_id, amount_fcfa } = req.body;

  res.json({
    checkout_url: `https://example.com/wave/pay?b=${booking_id}&amt=${amount_fcfa}`
  });
});

export default router;