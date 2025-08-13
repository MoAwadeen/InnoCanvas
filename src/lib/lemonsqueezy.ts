import { 
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  getOrder,
  type Checkout,
  type Order,
  type Subscription
} from '@lemonsqueezy/lemonsqueezy.js';

// Initialize LemonSqueezy
lemonSqueezySetup({
  apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
  onError: (error) => console.error("LemonSqueezy Error:", error),
});

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
  // Create a checkout session
  static async createCheckoutSession(data: {
    storeId: number;
    variantId: number;
    customPrice?: number;
    productOptions?: {
      name?: string;
      description?: string;
      media?: string[];
      redirectUrl?: string;
      receiptButtonText?: string;
      receiptLinkUrl?: string;
      enabled?: boolean;
    };
    checkoutOptions?: {
      embed?: boolean;
      media?: boolean;
      logo?: boolean;
      desc?: boolean;
      discount?: boolean;
    };
    checkoutData?: {
      email?: string;
      name?: string;
      billing_address?: {
        country?: string;
        zip?: string;
      };
      custom?: Record<string, any>;
    };
    expiresAt?: string;
    testMode?: boolean;
  }): Promise<Checkout> {
    try {
      const response = await createCheckout(
        data.storeId,
        data.variantId,
        {
          customPrice: data.customPrice,
          productOptions: data.productOptions,
          checkoutOptions: data.checkoutOptions,
          checkoutData: data.checkoutData,
          expiresAt: data.expiresAt,
          testMode: data.testMode
        }
      );

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Get subscription details
  static async getSubscription(subscriptionId: number): Promise<Subscription> {
    try {
      const response = await getSubscription(subscriptionId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  // Update subscription
  static async updateSubscription(subscriptionId: number, data: {
    pause?: { mode: 'void' | 'free'; resumesAt?: string | null };
    cancelAtPeriodEnd?: boolean;
  }): Promise<Subscription> {
    try {
      const response = await updateSubscription(subscriptionId, {
        pause: data.pause,
        cancelled: data.cancelAtPeriodEnd
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: number): Promise<Subscription> {
    try {
      const response = await cancelSubscription(subscriptionId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Pause subscription
  static async pauseSubscription(subscriptionId: number, data: {
    pauseUntil?: string;
  }): Promise<Subscription> {
    try {
      const response = await updateSubscription(subscriptionId, {
        pause: {
          mode: 'void',
          resumesAt: data.pauseUntil || null
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error pausing subscription:', error);
      throw error;
    }
  }

  // Resume subscription
  static async resumeSubscription(subscriptionId: number): Promise<Subscription> {
    try {
      const response = await updateSubscription(subscriptionId, {
        pause: null
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw error;
    }
  }

  // Get order details
  static async getOrder(orderId: number): Promise<Order> {
    try {
      const response = await getOrder(orderId);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}

// Webhook signature verification
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Webhook event handlers
export async function handleOrderCreated(orderData: any) {
  try {
    console.log('Order created:', orderData);
    // Handle order created event
    // Update user profile with order information
  } catch (error) {
    console.error('Error handling order created:', error);
    throw error;
  }
}

export async function handleSubscriptionCreated(subscriptionData: any) {
  try {
    console.log('Subscription created:', subscriptionData);
    // Handle subscription created event
    // Update user profile with subscription information
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(subscriptionData: any) {
  try {
    console.log('Subscription updated:', subscriptionData);
    // Handle subscription updated event
    // Update user profile with new subscription information
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

export async function handleSubscriptionCancelled(subscriptionData: any) {
  try {
    console.log('Subscription cancelled:', subscriptionData);
    // Handle subscription cancelled event
    // Update user profile to reflect cancellation
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
    throw error;
  }
}

// Main webhook handler
export async function handleLemonSqueezyWebhook(body: string, signature: string): Promise<{ success: boolean; message: string }> {
  try {
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return { success: false, message: 'Invalid webhook signature' };
    }

    const event = JSON.parse(body);
    const { event_name, data } = event;

    console.log('Webhook event received:', event_name);

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
        console.log('Unhandled webhook event:', event_name);
    }

    return { success: true, message: 'Webhook processed successfully' };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, message: 'Error processing webhook' };
  }
}
