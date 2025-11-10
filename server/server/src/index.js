import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import vehicles from './routes/vehicles.js';
import bookings from './routes/bookings.js';
import payments from './routes/payments.js';
import webhooks from './routes/webhooks.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api/vehicles', vehicles);
app.use('/api/bookings', bookings);
app.use('/api/payments', payments);
app.use('/api/webhooks', webhooks);

app.get('/', (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Cars221 API running on :${port}`));