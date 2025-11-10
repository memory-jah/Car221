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