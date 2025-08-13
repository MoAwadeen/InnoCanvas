# LemonSqueezy Payment Setup Guide

This guide will help you set up LemonSqueezy payments for InnoCanvas.

## 🚀 Quick Setup Steps

### 1. Create LemonSqueezy Account

1. Go to [LemonSqueezy](https://lemonsqueezy.com) and create an account
2. Complete your store setup
3. Add your business information and payment details

### 2. Create Your Products

#### Pro Plan Product
1. Go to your LemonSqueezy dashboard
2. Click "Create Product"
3. Set up the product:
   - **Name**: InnoCanvas Pro
   - **Description**: Advanced Business Model Canvas features
   - **Price**: $8/month (recurring)
   - **Billing**: Monthly subscription
   - **Status**: Published

#### Premium Plan Product
1. Create another product:
   - **Name**: InnoCanvas Premium
   - **Description**: Complete Business Model Canvas solution
   - **Price**: $15/month (recurring)
   - **Billing**: Monthly subscription
   - **Status**: Published

### 3. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy your **API Key**
3. Create a **Webhook Secret** (generate a random string)

### 4. Configure Environment Variables

Add these to your `.env.local` file:

```env
# LemonSqueezy Configuration
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here

# Store and Product IDs
NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID=your_store_id
NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID=your_pro_variant_id
NEXT_PUBLIC_LEMON_SQUEEZY_PREMIUM_VARIANT_ID=your_premium_variant_id
```

### 5. Set Up Webhooks

1. Go to **Settings** → **Webhooks**
2. Click "Create Webhook"
3. Configure:
   - **URL**: `https://yourdomain.com/api/lemonsqueezy/webhook`
   - **Events**: Select all subscription events
   - **Secret**: Use the same secret from step 3

### 6. Update Domain Configuration

For production, update your domain settings:

```env
NEXTAUTH_URL=https://innocanvas.site
```

## 📋 Detailed Configuration

### Product Variants

You need to create two subscription products:

#### Pro Plan ($8/month)
- **Features**: Up to 10 canvases, PDF export, color customization
- **Variant ID**: Copy from LemonSqueezy dashboard
- **Billing**: Monthly recurring

#### Premium Plan ($15/month)
- **Features**: Unlimited canvases, all Pro features, watermark removal
- **Variant ID**: Copy from LemonSqueezy dashboard
- **Billing**: Monthly recurring

### Webhook Events

The webhook handles these events:
- `order_created` - When a new order is placed
- `subscription_created` - When a subscription starts
- `subscription_updated` - When subscription details change
- `subscription_cancelled` - When subscription is cancelled

### Database Updates

The webhook automatically updates user plans in your Supabase database:
- Updates `profiles.plan` field
- Sets `subscription_id` and `payment_provider`
- Handles plan upgrades and downgrades

## 🔧 Testing

### Test Mode
1. Use LemonSqueezy test mode for development
2. Test with these card numbers:
   - **Success**: 4242 4242 4242 4242
   - **Decline**: 4000 0000 0000 0002

### Test Webhooks
1. Use [ngrok](https://ngrok.com) for local testing
2. Set webhook URL to your ngrok URL
3. Test all webhook events

## 🚀 Production Deployment

### 1. Update Environment Variables
```env
NEXTAUTH_URL=https://innocanvas.site
LEMON_SQUEEZY_API_KEY=your_production_api_key
LEMON_SQUEEZY_WEBHOOK_SECRET=your_production_webhook_secret
```

### 2. Update Webhook URL
Set webhook URL to: `https://innocanvas.site/api/lemonsqueezy/webhook`

### 3. Test Production Flow
1. Create a test purchase
2. Verify webhook updates
3. Check user plan changes

## 📊 Monitoring

### Webhook Logs
Check your server logs for webhook events:
```bash
# Monitor webhook calls
tail -f your-app.log | grep "webhook"
```

### Database Monitoring
Monitor user plan changes:
```sql
SELECT id, email, plan, subscription_id, updated_at 
FROM profiles 
WHERE plan != 'free' 
ORDER BY updated_at DESC;
```

## 🔒 Security

### Webhook Verification
- All webhooks are verified using HMAC signatures
- Invalid signatures are rejected
- Webhook secret is stored securely

### API Key Security
- API key is server-side only
- Never expose in client-side code
- Use environment variables

## 🆘 Troubleshooting

### Common Issues

#### Webhook Not Receiving Events
1. Check webhook URL is correct
2. Verify webhook secret matches
3. Check server logs for errors
4. Ensure webhook is enabled

#### Payment Not Processing
1. Verify API key is correct
2. Check variant IDs match
3. Ensure products are published
4. Test with valid card numbers

#### User Plan Not Updating
1. Check webhook is receiving events
2. Verify database connection
3. Check user email matches
4. Review webhook logs

### Support
- **LemonSqueezy Support**: [support.lemonsqueezy.com](https://support.lemonsqueezy.com)
- **InnoCanvas Issues**: Check GitHub issues
- **Email Support**: support@innocanvas.site

## 📈 Analytics

### Track Payment Metrics
- Conversion rates
- Revenue per user
- Churn rates
- Plan distribution

### Monitor Key Metrics
- Successful payments
- Failed payments
- Subscription cancellations
- Plan upgrades/downgrades

## 🎯 Next Steps

1. **Set up your LemonSqueezy account**
2. **Create your products and variants**
3. **Configure environment variables**
4. **Set up webhooks**
5. **Test the payment flow**
6. **Deploy to production**
7. **Monitor and optimize**

Your payment system will be fully functional once these steps are completed!
