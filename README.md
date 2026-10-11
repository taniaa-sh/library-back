# Express (TS + Mongoose)

## Setup

1. Copy files into a folder.
2. Create `.env` by copying `.env.example` and fill values.
3. Install:
   npm install

4. Run dev server:
   npm run dev

APIs:
- POST /api/auth/captcha -> { id, value } (dev)
- POST /api/auth/register -> register user
- POST /api/auth/confirmRegister -> confirm and set username/password
- POST /api/auth/login -> returns accessToken
- POST /api/auth/logout -> requires Authorization header
- POST /api/auth/qrcode -> generate 2fa QR (account + password)
- POST /api/news -> create news
- GET /api/news -> list news

This repo is intentionally minimal to match the Nest structure and behavior. Expand or secure it for production.