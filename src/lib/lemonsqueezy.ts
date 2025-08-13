import { createClient } from '@lemonsqueezy/lemonsqueezy.js';

// Initialize LemonSqueezy client
const client = createClient(process.env.LEMON_SQUEEZY_API_KEY!);

export interface LemonSqueezyProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  pay_what_you_want: boolean;
  has_variants: boolean;
  variants: LemonSqueezyVariant[];
}

export interface LemonSqueezyVariant {
  id: number;
  name: string;
  price: number;
  is_subscription: boolean;
  interval: string;
  interval_count: number;
  trial_ends_at: string | null;
  renews_at: string | null;
  ends_at: string | null;
  status: string;
}

export interface LemonSqueezyCheckout {
  id: string;
  url: string;
  expires_at: string;
}

export interface LemonSqueezyOrder {
  id: number;
  identifier: string;
  order_number: number;
  status: string;
  currency: string;
  currency_rate: string;
  subtotal: number;
  discount_total: number;
  tax: number;
  total: number;
  subtotal_formatted: string;
  discount_total_formatted: string;
  tax_formatted: string;
  total_formatted: string;
  urls: {
    update_payment_method: string;
  };
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}

export interface LemonSqueezySubscription {
  id: number;
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  user_name: string;
  user_email: string;
  status: string;
  status_formatted: string;
  card_brand: string;
  card_last_four: string;
  pause: any;
  cancelled: boolean;
  trial_ends_at: string | null;
  renews_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}

export class LemonSqueezyService {
  // Get all products from your store
  static async getProducts(): Promise<LemonSqueezyProduct[]> {
    try {
      const response = await client.listAllProducts();
      return response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get a specific product by ID
  static async getProduct(productId: number): Promise<LemonSqueezyProduct> {
    try {
      const response = await client.retrieveProduct({ id: productId });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create a checkout session
  static async createCheckout(data: {
    storeId: number;
    variantId: number;
    customPrice?: number;
    productOptions?: {
      name?: string;
      description?: string;
      redirect?: string;
      receipt_button_text?: string;
      receipt_link_url?: string;
      enabled?: boolean;
    };
    checkoutOptions?: {
      embed?: boolean;
      media?: boolean;
      logo?: boolean;
      desc?: boolean;
      discount?: boolean;
      name?: boolean;
      email?: boolean;
      address?: boolean;
      phone?: boolean;
      quantity?: boolean;
      pay_what_you_want?: boolean;
      custom_price?: boolean;
      product_options?: boolean;
      enabled?: boolean;
    };
    prefill?: {
      name?: string;
      email?: string;
    };
  }): Promise<LemonSqueezyCheckout> {
    try {
      const response = await client.createCheckout({
        data: {
          type: 'checkouts',
          attributes: {
            store_id: data.storeId,
            variant_id: data.variantId,
            custom_price: data.customPrice,
            product_options: data.productOptions,
            checkout_options: data.checkoutOptions,
            prefill: data.prefill,
          },
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  }

  // Get order details
  static async getOrder(orderId: number): Promise<LemonSqueezyOrder> {
    try {
      const response = await client.retrieveOrder({ id: orderId });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Get subscription details
  static async getSubscription(subscriptionId: number): Promise<LemonSqueezySubscription> {
    try {
      const response = await client.retrieveSubscription({ id: subscriptionId });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  // Update subscription
  static async updateSubscription(subscriptionId: number, data: {
    pause?: boolean;
    cancelled?: boolean;
  }): Promise<LemonSqueezySubscription> {
    try {
      const response = await client.updateSubscription({
        id: subscriptionId,
        data: {
          type: 'subscriptions',
          attributes: data,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: number): Promise<LemonSqueezySubscription> {
    return this.updateSubscription(subscriptionId, { cancelled: true });
  }

  // Pause subscription
  static async pauseSubscription(subscriptionId: number): Promise<LemonSqueezySubscription> {
    return this.updateSubscription(subscriptionId, { pause: true });
  }

  // Resume subscription
  static async resumeSubscription(subscriptionId: number): Promise<LemonSqueezySubscription> {
    return this.updateSubscription(subscriptionId, { pause: false });
  }
}

// Webhook handler for LemonSqueezy events
export async function handleLemonSqueezyWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify webhook signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return { success: false, message: 'Invalid signature' };
    }

    const event = JSON.parse(body);
    const { event_name, data } = event;

    switch (event_name) {
      case 'order_created':
        await handleOrderCreated(data);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data);
        break;
      default:
        console.log(`Unhandled event: ${event_name}`);
    }

    return { success: true, message: 'Webhook processed successfully' };
  } catch (error) {
    console.error('Webhook error:', error);
    return { success: false, message: 'Webhook processing failed' };
  }
}

// Webhook event handlers
async function handleOrderCreated(data: any) {
  console.log('Order created:', data);
  // Update user's plan based on the order
  // This will be implemented when we connect to Supabase
}

async function handleSubscriptionCreated(data: any) {
  console.log('Subscription created:', data);
  // Update user's subscription status
  // This will be implemented when we connect to Supabase
}

async function handleSubscriptionUpdated(data: any) {
  console.log('Subscription updated:', data);
  // Update user's subscription details
  // This will be implemented when we connect to Supabase
}

async function handleSubscriptionCancelled(data: any) {
  console.log('Subscription cancelled:', data);
  // Downgrade user to free plan
  // This will be implemented when we connect to Supabase
}
