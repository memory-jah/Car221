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