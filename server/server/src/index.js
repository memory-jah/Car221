import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ ok: true, name: 'Cars221 API', region: 'Senegal', currency: 'XOF' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Cars221 API running on :${port}`));