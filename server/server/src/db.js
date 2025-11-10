// Super simple in-memory store (temporary)
export const db = {
  vehicles: [],
  bookings: [],
  webhookEvents: []
};

// Seed example vehicles
export function seed() {
  if (db.vehicles.length) return;
  db.vehicles.push(
    {
      id: "1",
      host_id: 'host-1',
      title: 'Toyota Corolla 2019',
      make: 'Toyota', model: 'Corolla', year: 2019,
      plate: 'DK-1234-A',
      seats: 5, transmission: 'automatic', fuel_type: 'essence',
      features: ['AC', 'Bluetooth'],
      photos: [],
      location: { lat: 14.7167, lng: -17.4677, address: 'Dakar' },
      price_day_fcfa: 18000,
      weekend_multiplier: 1.1,
      min_days: 1,
      deposit_fcfa: 50000,
      status: 'active',
      created_at: new Date().toISOString()
    }
  );
}
seed();

export const db = {
  users: [],          // <— add this
  vehicles: [],
  bookings: [],
  webhookEvents: []
};

// OPTIONAL helper:
export function findUserByEmail(email) {
  return db.users.find(u => u.email?.toLowerCase() === String(email).toLowerCase());
}