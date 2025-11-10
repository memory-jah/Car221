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

Login

POST /api/auth/login

Body:
```json
{
  "email": "test@cars221.sn",
  "password": "123456"
}

Get current user

GET /api/auth/me

Headers:
Authorization: Bearer <token>

Project structure
server/
  src/
    routes/
    db.js
    index.js

mobile/
  App.js
  components/
  services/
  
  ---

## TODO (next steps)

- Wave payment checkout
- Host mode screens
- Vehicle image uploads
- KYC/Identity