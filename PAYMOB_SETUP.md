# Paymob Accept Setup Guide

This guide will help you set up Paymob Accept payment processing for InnoCanvas.

## 🚀 Quick Setup Steps

### 1. Create Paymob Accept Account

1. Go to [Paymob Accept](https://accept.paymob.com/) and create an account
2. Complete your business verification
3. Add your business information and banking details
4. Wait for account approval (usually 1-2 business days)

### 2. Create Subscription Plans

Paymob supports recurring subscriptions. You need to create two subscription plans:

#### Pro Plan ($8/month)
1. Log into your Paymob dashboard
2. Navigate to **Subscriptions** → **Plans**
3. Click **Create Plan**
4. Configure:
   - **Name**: InnoCanvas Pro
   - **Description**: Advanced Business Model Canvas features
   - **Amount**: 800 cents ($8.00)
   - **Currency**: USD
   - **Billing Interval**: Monthly (1 month)
   - **Status**: Active
5. Save and copy the **Plan ID**

#### Premium Plan ($15/month)
1. Create another plan:
   - **Name**: InnoCanvas Premium
   - **Description**: Complete Business Model Canvas solution
   - **Amount**: 1500 cents ($15.00)
   - **Currency**: USD
   - **Billing Interval**: Monthly (1 month)
   - **Status**: Active
2. Save and copy the **Plan ID**

### 3. Get Your API Keys

1. Go to **Settings** → **Account Info** → **API Keys**
2. Copy your:
   - **API Key** (Secret Key)
   - **Public Key**
   - **Integration ID** (from Payment Integrations section)
3. Generate a **Webhook Secret** (create a random secure string, e.g., using `openssl rand -hex 32`)

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Paymob Configuration
PAYMOB_API_KEY=your_api_key_here
PAYMOB_PUBLIC_KEY=your_public_key_here
PAYMOB_WEBHOOK_SECRET=your_webhook_secret_here
PAYMOB_INTEGRATION_ID=your_integration_id_here

# Subscription Plan IDs
NEXT_PUBLIC_PAYMOB_PRO_PLAN_ID=your_pro_plan_id
NEXT_PUBLIC_PAYMOB_PREMIUM_PLAN_ID=your_premium_plan_id

# Supabase Service Role Key (for webhooks)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Set Up Webhooks

1. Go to **Settings** → **Webhooks**
2. Click **Create Webhook**
3. Configure:
   - **URL**: `https://yourdomain.com/api/paymob/webhook`
   - **Events**: Select:
     - `TRANSACTION` (for successful payments)
     - `subscription.created`
     - `subscription.updated`
     - `subscription.cancelled`
   - **HMAC Secret**: Use the same secret from step 3
4. Save the webhook configuration

### 6. Update Frontend Files

You need to manually update the following files to use Paymob instead of Lemon Squeezy:

#### `src/app/payment/page.tsx`
Replace all occurrences of:
- `LEMON_SQUEEZY_PRO_VARIANT_ID` → `PAYMOB_PRO_PLAN_ID`
- `LEMON_SQUEEZY_PREMIUM_VARIANT_ID` → `PAYMOB_PREMIUM_PLAN_ID`
- `LEMON_SQUEEZY_STORE_ID` → (remove this, not needed for Paymob)
- `/api/lemonsqueezy/checkout` → `/api/paymob/checkout`
- Change the request body from `{variantId, storeId, ...}` to `{planId, ...}`
- Update "LemonSqueezy" text to "Paymob"

#### `src/components/subscription-manager.tsx`
Replace:
- `/api/lemonsqueezy/subscription/` → `/api/paymob/subscription/`

#### `src/app/privacy/page.tsx`
Replace:
- "LemonSqueezy" → "Paymob"

#### `src/app/terms/page.tsx`
Replace:
- "LemonSqueezy" → "Paymob"

### 7. Remove Lemon Squeezy Dependencies

```bash
npm uninstall @lemonsqueezy/lemonsqueezy.js
```

Delete the following files/directories:
- `src/lib/lemonsqueezy.ts`
- `src/app/api/lemonsqueezy/` (entire directory)
- `LEMON_SQUEEZY_SETUP.md`

### 8. Update Documentation

#### Update `README.md`:
- Replace LemonSqueezy badge with Paymob badge
- Update environment variables section
- Update API routes documentation
- Update features list

#### Update `env.example`:
Remove Lemon Squeezy variables and add Paymob variables as shown in step 4.

## 🔧 Testing

### Local Testing with ngrok

1. Install [ngrok](https://ngrok.com):
   ```bash
   npm install -g ngrok
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. In another terminal, start ngrok:
   ```bash
   ngrok http 9002
   ```

4. Copy the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`)

5. Update your Paymob webhook URL to:
   ```
   https://abc123.ngrok.io/api/paymob/webhook
   ```

### Test Subscription Flow

1. Navigate to `/payment` page
2. Select a plan (Pro or Premium)
3. Click "Continue to Payment"
4. You should be redirected to Paymob's checkout page
5. Use Paymob's test card numbers:
   - **Success**: 4987654321098769
   - **Decline**: 4000000000000002
6. Complete the payment
7. Check your database to verify:
   - User's `plan` field is updated
   - `subscription_id` is set
   - `payment_provider` is set to 'paymob'

### Test Webhook Events

1. Monitor your server logs for webhook events
2. Test subscription actions:
   - Create a subscription
   - Cancel a subscription
   - Resume a subscription
3. Verify database updates after each action

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Paymob account fully verified and approved
- [ ] Subscription plans created and active
- [ ] All environment variables configured in production
- [ ] Webhook URL updated to production domain
- [ ] Frontend files updated to use Paymob
- [ ] Lemon Squeezy dependencies removed
- [ ] Documentation updated
- [ ] Test subscription flow in production
- [ ] Monitor webhook logs

### Deploy Steps

1. **Update Environment Variables** in your hosting platform (Vercel, etc.):
   ```env
   PAYMOB_API_KEY=prod_api_key
   PAYMOB_PUBLIC_KEY=prod_public_key
   PAYMOB_WEBHOOK_SECRET=prod_webhook_secret
   PAYMOB_INTEGRATION_ID=prod_integration_id
   NEXT_PUBLIC_PAYMOB_PRO_PLAN_ID=prod_pro_plan_id
   NEXT_PUBLIC_PAYMOB_PREMIUM_PLAN_ID=prod_premium_plan_id
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Update Webhook URL** in Paymob dashboard:
   ```
   https://innocanvas.site/api/paymob/webhook
   ```

3. **Deploy** your application

4. **Test** the complete flow in production

## 📊 Monitoring

### Webhook Logs

Monitor webhook events in your server logs:
```bash
# View recent webhook events
tail -f /var/log/your-app.log | grep "Webhook event"
```

### Database Monitoring

Check subscription status:
```sql
SELECT id, email, plan, subscription_id, payment_provider, updated_at 
FROM profiles 
WHERE plan != 'free' 
ORDER BY updated_at DESC;
```

### Paymob Dashboard

Monitor transactions and subscriptions in your Paymob dashboard:
- **Transactions**: View all payment transactions
- **Subscriptions**: Monitor active, cancelled, and expired subscriptions
- **Reports**: Generate financial reports

## 🔒 Security

### Best Practices

1. **Never expose API keys** in client-side code
2. **Always verify webhook signatures** using HMAC
3. **Use HTTPS** for all webhook endpoints
4. **Store secrets** in environment variables
5. **Rotate keys** periodically
6. **Monitor** for suspicious activity

### Webhook Security

The webhook handler in `src/app/api/paymob/webhook/route.ts` includes:
- HMAC signature verification
- Request validation
- Error handling
- Logging

## 🆘 Troubleshooting

### Common Issues

#### Webhook Not Receiving Events
1. Check webhook URL is correct and accessible
2. Verify HMAC secret matches
3. Check server logs for errors
4. Ensure webhook is enabled in Paymob dashboard
5. Test with ngrok for local development

#### Payment Not Processing
1. Verify API keys are correct
2. Check plan IDs match
3. Ensure plans are active
4. Test with valid test card numbers
5. Check Paymob dashboard for error messages

#### User Plan Not Updating
1. Check webhook is receiving events (check logs)
2. Verify database connection
3. Check user email matches
4. Review webhook handler logs
5. Ensure Supabase service role key is set

#### Authentication Errors
1. Verify API key is valid
2. Check token expiration (tokens expire after 1 hour)
3. Ensure authentication is called before API requests

### Support Resources

- **Paymob Documentation**: [developers.paymob.com](https://developers.paymob.com/egypt)
- **Paymob Support**: support@paymob.com
- **InnoCanvas Issues**: Check GitHub issues

## 📈 Next Steps

After successful setup:

1. **Monitor** initial transactions closely
2. **Collect feedback** from users
3. **Optimize** checkout flow based on analytics
4. **Add features**:
   - Annual billing option
   - Proration for plan changes
   - Trial periods
   - Discount codes
5. **Scale** as needed

## 🎯 Summary

Your Paymob integration includes:

✅ **Core Library** (`src/lib/paymob.ts`):
- Authentication with token caching
- Subscription plan creation
- Subscription management (create, cancel, suspend, resume)
- Payment intention creation
- Webhook verification and handling

✅ **API Routes**:
- `POST /api/paymob/checkout` - Create subscription checkout
- `POST /api/paymob/webhook` - Handle webhook events
- `GET /api/paymob/subscription/[id]` - Get subscription details
- `POST /api/paymob/subscription/[id]/cancel` - Cancel subscription
- `POST /api/paymob/subscription/[id]/resume` - Resume subscription

✅ **Database Integration**:
- Automatic user plan updates
- Subscription ID tracking
- Payment provider tracking

🔄 **Remaining Manual Steps**:
1. Update frontend files (payment page, subscription manager, privacy, terms)
2. Remove Lemon Squeezy dependencies
3. Update documentation
4. Configure environment variables
5. Set up webhooks
6. Test and deploy

Your payment system will be fully functional once these steps are completed!
