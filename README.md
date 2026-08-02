# AN Out & About

Event Booking Platform built with:

- React + TanStack Router
- TypeScript
- Supabase
- Cloudflare Pages
- Manual UPI Payment

---

# Clone the project

```bash
git clone https://github.com/<your-username>/<repo-name>.git

cd <repo-name>

npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
# ==========================
# Supabase
# ==========================

SUPABASE_PROJECT_ID=YOUR_SUPABASE_PROJECT_ID
SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# ==========================
# Frontend
# ==========================

VITE_SUPABASE_PROJECT_ID=YOUR_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co

# ==========================
# Optional (Future Razorpay)
# Leave blank if using Manual UPI
# ==========================

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

---

# Run locally

```bash
npm run dev
```

---

# Production Build

```bash
npm run build
```

---

# Deploy to Cloudflare Pages

Build Command

```bash
npm run build
```

Build Output Directory

```
dist
```

Node Version

```
22
```

---

# Cloudflare Environment Variables

Add the following variables inside

Settings → Environment Variables

```
SUPABASE_PROJECT_ID
SUPABASE_PUBLISHABLE_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
```

---

# Supabase Setup

1. Create a new Supabase Project.

2. Copy:

- Project URL
- Publishable (Anon) Key
- Service Role Key

3. Create the required:

- Tables
- Storage Buckets
- Policies
- Edge Functions (if required)

---

# Storage Buckets

Create the following bucket:

```
payment-screenshots
```

Make sure proper Storage Policies are enabled.

---

# Payment System

Current:

✅ Manual UPI Payment

Future Ready:

- Razorpay
- Webhooks
- Instant Verification

Simply add Razorpay environment variables and enable the payment code.

---

# Notes

- Never commit your `.env` file.
- Keep the Service Role Key secret.
- Rotate keys immediately if they are ever exposed.
