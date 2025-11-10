import { API_BASE } from '../constants_config';

export async function listVehicles() {
  const res = await fetch(`${API_BASE}/api/vehicles`);
  if (!res.ok) throw new Error('Failed to load vehicles');
  return res.json();
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create booking');
  return res.json();
}

export async function createWaveCheckout({ booking_id, amount_fcfa }) {
  const res = await fetch(`${API_BASE}/api/payments/wave/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ booking_id, amount_fcfa })
  });
  if (!res.ok) throw new Error('Failed to start checkout');
  return res.json();
}

export async function createVehicle(payload) {
  const res = await fetch(`${API_BASE}/api/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to add vehicle');
  return res.json();
}

// auth
export async function signup(payload) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed signup');
  return res.json();
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed login');
  return res.json();
}

// bookings
export async function listBookings({ renter_id } = {}) {
  const qs = renter_id ? `?renter_id=${encodeURIComponent(renter_id)}` : '';
  const res = await fetch(`${API_BASE}/api/bookings${qs}`);
  if (!res.ok) throw new Error('Failed to load bookings');
  return res.json();
}

// KYC submit
export async function submitKyc({ user_id, id_type, id_number, photo_url }) {
  const res = await fetch(`${API_BASE}/api/kyc/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, id_type, id_number, photo_url })
  });
  if (!res.ok) throw new Error('Failed to submit KYC');
  return res.json();
}

// KYC status
export async function getKycStatus(user_id) {
  const res = await fetch(`${API_BASE}/api/kyc/status?user_id=${encodeURIComponent(user_id)}`);
  if (!res.ok) throw new Error('Failed to get KYC status');
  return res.json();
}

/* -------------------- WALLET HELPERS -------------------- */

// balance
export async function getWalletBalance(user_id) {
  const res = await fetch(`${API_BASE}/api/wallet/balance?user_id=${encodeURIComponent(user_id)}`);
  if (!res.ok) throw new Error('Failed to load balance');
  return res.json(); // { balance_fcfa }
}

// transactions
export async function getWalletTransactions(user_id) {
  const res = await fetch(`${API_BASE}/api/wallet/transactions?user_id=${encodeURIComponent(user_id)}`);
  if (!res.ok) throw new Error('Failed to load transactions');
  return res.json(); // { transactions: [...] }
}

// withdraw (6% fee handled server-side)
export async function withdrawWallet({ user_id, amount_fcfa, dest = 'wave_visa', card_last4 }) {
  const res = await fetch(`${API_BASE}/api/wallet/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, amount_fcfa, dest, card_last4 })
  });
  if (!res.ok) throw new Error('Failed to withdraw');
  return res.json(); // { ok, new_balance_fcfa, fee_fcfa, payout_fcfa }
}