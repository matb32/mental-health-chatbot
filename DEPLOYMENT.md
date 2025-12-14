# Deployment Guide - Addapt.ai

## 🚀 Quick Deploy to Vercel (Recommended)

### Step 1: Connect to Vercel

1. Go to **[https://vercel.com/new](https://vercel.com/new)**
2. Sign in with your GitHub account
3. Click **"Import Project"**
4. Select repository: `matb32/mental-health-chatbot`
5. Choose branch: `main` (or `claude/fix-infinite-loop-PLyGS` for testing)

### Step 2: Configure Environment Variables

In the Vercel dashboard, add these environment variables:

```bash
# Stripe Configuration (Required for payments)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**Get your Stripe keys:**
- Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
- Copy your test keys (or live keys for production)

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-app.vercel.app`

### Step 4: Test the Fix

Visit: `https://your-app.vercel.app/payment-success?session_id=test_123`

**Expected behavior:**
- ✅ Page loads once
- ✅ Shows "Verifying your payment..." then error (expected for fake session)
- ✅ NO infinite reloading
- ✅ Console shows verification attempt only ONCE

---

## 🔄 Automatic Deployments

Vercel will automatically deploy:
- **Production:** When you push to `main` branch
- **Preview:** When you create/update pull requests

---

## 📦 Alternative: Deploy to Netlify

### Step 1: Connect to Netlify

1. Go to **[https://app.netlify.com/start](https://app.netlify.com/start)**
2. Connect your GitHub repository
3. Select `matb32/mental-health-chatbot`

### Step 2: Build Settings

```bash
Build command: npm run build
Publish directory: .next
```

### Step 3: Environment Variables

Add the same Stripe environment variables as above in:
**Site settings → Environment variables**

---

## 🐳 Alternative: Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Run

```bash
docker build -t addapt-ai .
docker run -p 3000:3000 --env-file .env.local addapt-ai
```

---

## 🌐 Custom Server Deployment

### Prerequisites
- Node.js 18+ installed
- PM2 for process management
- Nginx for reverse proxy

### Steps

1. **Clone & Install**
```bash
git clone https://github.com/matb32/mental-health-chatbot.git
cd mental-health-chatbot
npm install
```

2. **Configure Environment**
```bash
cp .env.local.example .env.local
# Edit .env.local with your Stripe keys
```

3. **Build**
```bash
npm run build
```

4. **Start with PM2**
```bash
npm install -g pm2
pm2 start npm --name "addapt-ai" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx** (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Production Checklist

Before going live:

- [ ] Set up proper Stripe account (not test mode)
- [ ] Configure custom domain
- [ ] Enable HTTPS/SSL
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure analytics
- [ ] Review GDPR compliance
- [ ] Set up database for data persistence
- [ ] Configure backup strategy
- [ ] Test payment flow end-to-end
- [ ] Review security headers
- [ ] Set up uptime monitoring

---

## 📊 Monitoring

### Vercel Analytics
- Automatically enabled on Vercel
- View at: https://vercel.com/[your-username]/[project]/analytics

### Custom Monitoring
Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - Usage tracking
- **Stripe Dashboard** - Payment monitoring

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Restart development server after changes
- Check Vercel/Netlify dashboard for variable configuration

### Stripe Integration Issues
- Verify webhook secret matches Stripe dashboard
- Check Stripe API version compatibility
- Test with Stripe test mode first

---

## 📞 Support

For deployment issues:
- **Vercel:** [https://vercel.com/support](https://vercel.com/support)
- **Netlify:** [https://www.netlify.com/support](https://www.netlify.com/support)
- **Project Issues:** [GitHub Issues](https://github.com/matb32/mental-health-chatbot/issues)
