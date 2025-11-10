import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, findUserByEmail } from '../db.js';

const router = Router();

function signToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'renter'
  };
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  try {
    let { name, email, password, role = 'renter' } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password required' });
    }

    email = String(email).trim().toLowerCase();
    if (findUserByEmail(email)) {
      return res.status(409).json({ error: 'email_already_registered' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'weak_password' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: String(Date.now()),
      name,
      email,
      password_hash: hash,
      role,
      kyc_status: 'pending',           // <-- important for KYC
      created_at: new Date().toISOString()
    };

    db.users.push(user);

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kyc_status: user.kyc_status    // <-- return it to the app
      }
    });
  } catch (e) {
    return res.status(500).json({ error: 'server_error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body || {};
    email = String(email || '').trim().toLowerCase();

    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'invalid_credentials' });

    const ok = await bcrypt.compare(password || '', user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid_credentials' });

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        kyc_status: user.kyc_status    // <-- return it here too
      }
    });
  } catch (e) {
    return res.status(500).json({ error: 'server_error' });
  }
});

router.get('/me', (req, res) => {
  try {
    const auth = req.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'missing_token' });

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = db.users.find(u => u.id === payload.id);
    if (!user) return res.status(401).json({ error: 'invalid_token' });

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      kyc_status: user.kyc_status      // <-- and here
    });
  } catch {
    return res.status(401).json({ error: 'invalid_token' });
  }
});

export default router;