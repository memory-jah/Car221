# Cars221

Peer-to-peer car rental marketplace for Senegal.

## Authentication (MVP)

Email + password auth (in-memory) is implemented.

---

### Signup
`POST /api/auth/signup`

Body:
```json
{
  "name": "Mame Mor",
  "email": "test@cars221.sn",
  "password": "123456"
}

{
  "email": "test@cars221.sn",
  "password": "123456"
}

Authorization: Bearer <token>

server/
  src/
    routes/
    db.js
    index.js

mobile/
  App.js
  components/
  services/