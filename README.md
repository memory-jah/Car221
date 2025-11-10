# Car221
Carrental















## Authentication (MVP)

Email + password auth (in-memory) is implemented.

### Signup
`POST /api/auth/signup`

Body:
```json
{
  "name": "Mame Mor",
  "email": "test@cars221.sn",
  "password": "123456"
}