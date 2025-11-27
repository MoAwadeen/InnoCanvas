import crypto from 'crypto';

// Paymob API Configuration
const PAYMOB_API_URL = 'https://accept.paymob.com/api';

// Initialize Paymob configuration
const config = {
  apiKey: process.env.PAYMOB_API_KEY!,
  publicKey: process.env.PAYMOB_PUBLIC_KEY!,
  webhookSecret: process.env.PAYMOB_WEBHOOK_SECRET!,
  integrationId: process.env.PAYMOB_INTEGRATION_ID!,
};

// Type Definitions
export interface PaymobAuthResponse {
  token: string;
  profile: {
    id: number;
    user: {
      id: number;
      username: string;
      email: string;
    };
  };
}

export interface PaymobSubscriptionPlan {
  id: number;
  name: string;
  description: string;
  amount_cents: number;
  currency: string;
  interval: 'month' | 'year';
  interval_count: number;
  trial_period_days?: number;
  created_at: string;
}

export interface PaymobSubscription {
  id: number;
  plan_id: number;
  customer_id: number;
  status: 'active' | 'suspended' | 'cancelled' | 'expired';
  start_date: string;
  next_billing_date: string;
  end_date?: string;
  trial_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymobIntention {
  id: number;
  amount_cents: number;
  currency: string;
  payment_methods: string[];
  items: Array<{
    name: string;
    amount: number;
    description: string;
    quantity: number;
  }>;
  billing_data: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    country?: string;
  };
  customer: {
    id: number;
    email: string;
  };
  payment_url?: string;
}

export interface PaymobWebhookEvent {
  type: string;
  obj: {
    id: number;
    amount_cents: number;
    success: boolean;
    is_refunded: boolean;
    is_voided: boolean;
    is_captured: boolean;
    currency: string;
    integration_id: number;
    order: {
      id: number;
      amount_cents: number;
      currency: string;
      merchant_order_id: string;
      items: any[];
    };
    subscription?: {
      id: number;
      plan_id: number;
      status: string;
    };
  };
}

// Paymob Service Class
export class PaymobService {
  private static authToken: string | null = null;
  private static tokenExpiry: number = 0;

  // Authenticate and get token
  static async authenticate(): Promise<string> {
    // Return cached token if still valid
    if (this.authToken && Date.now() < this.tokenExpiry) {
      return this.authToken;
    }

    try {
      const response = await fetch(`${PAYMOB_API_URL}/auth/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: config.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`);
      }

      const data: PaymobAuthResponse = await response.json();
      this.authToken = data.token;
      // Token expires in 1 hour, refresh 5 minutes before
      this.tokenExpiry = Date.now() + 55 * 60 * 1000;

      return data.token;
    } catch (error) {
      console.error('Paymob authentication error:', error);
      throw error;
    }
  }

  // Create Subscription Plan
  static async createSubscriptionPlan(data: {
    name: string;
    description: string;
    amountCents: number;
    currency: string;
    interval: 'month' | 'year';
    intervalCount?: number;
  }): Promise<PaymobSubscriptionPlan> {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${PAYMOB_API_URL}/acceptance/subscription_plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          amount_cents: data.amountCents,
          currency: data.currency,
          interval: data.interval,
          interval_count: data.intervalCount || 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create subscription plan: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription plan:', error);
      throw error;
    }
  }

  // Create Subscription
  static async createSubscription(data: {
    planId: number;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    successUrl: string;
    failureUrl: string;
  }): Promise<{ subscription_id: number; payment_url: string }> {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${PAYMOB_API_URL}/acceptance/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_id: data.planId,
          integration_id: config.integrationId,
          billing_data: {
            email: data.customerEmail,
            first_name: data.customerName.split(' ')[0] || data.customerName,
            last_name: data.customerName.split(' ').slice(1).join(' ') || '',
            phone_number: data.customerPhone || '+20000000000',
          },
          success_url: data.successUrl,
          failure_url: data.failureUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create subscription: ${response.statusText} - ${errorData}`);
      }

      const result = await response.json();
      return {
        subscription_id: result.id,
        payment_url: result.payment_url || result.iframe_url,
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Get Subscription Details
  static async getSubscription(subscriptionId: number): Promise<PaymobSubscription> {
    try {
      const token = await this.authenticate();

      const response = await fetch(
        `${PAYMOB_API_URL}/acceptance/subscriptions/${subscriptionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get subscription: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  // Cancel Subscription
  static async cancelSubscription(subscriptionId: number): Promise<PaymobSubscription> {
    try {
      const token = await this.authenticate();

      const response = await fetch(
        `${PAYMOB_API_URL}/acceptance/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Suspend Subscription
  static async suspendSubscription(subscriptionId: number): Promise<PaymobSubscription> {
    try {
      const token = await this.authenticate();

      const response = await fetch(
        `${PAYMOB_API_URL}/acceptance/subscriptions/${subscriptionId}/suspend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to suspend subscription: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error suspending subscription:', error);
      throw error;
    }
  }

  // Resume Subscription
  static async resumeSubscription(subscriptionId: number): Promise<PaymobSubscription> {
    try {
      const token = await this.authenticate();

      const response = await fetch(
        `${PAYMOB_API_URL}/acceptance/subscriptions/${subscriptionId}/resume`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to resume subscription: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error resuming subscription:', error);
      throw error;
    }
  }

  // Create Payment Intention (for one-time payments or initial subscription setup)
  static async createIntention(data: {
    amountCents: number;
    currency: string;
    customerEmail: string;
    customerName: string;
    items: Array<{
      name: string;
      amount: number;
      description: string;
      quantity: number;
    }>;
  }): Promise<PaymobIntention> {
    try {
      const token = await this.authenticate();

      const response = await fetch(`${PAYMOB_API_URL}/ecommerce/intentions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: data.amountCents,
          currency: data.currency,
          payment_methods: [config.integrationId],
          items: data.items,
          billing_data: {
            email: data.customerEmail,
            first_name: data.customerName.split(' ')[0] || data.customerName,
            last_name: data.customerName.split(' ').slice(1).join(' ') || '',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create intention: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intention:', error);
      throw error;
    }
  }
}

// Webhook Verification and Handling
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    const hmac = crypto
      .createHmac('sha512', config.webhookSecret)
      .update(payload)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(hmac)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

// Webhook Event Handlers
export async function handleSubscriptionCreated(subscriptionData: any) {
  try {
    console.log('Subscription created:', subscriptionData);
    // This will be handled in the webhook route with Supabase updates
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(subscriptionData: any) {
  try {
    console.log('Subscription updated:', subscriptionData);
    // This will be handled in the webhook route with Supabase updates
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

export async function handleSubscriptionCancelled(subscriptionData: any) {
  try {
    console.log('Subscription cancelled:', subscriptionData);
    // This will be handled in the webhook route with Supabase updates
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
    throw error;
  }
}

export async function handleTransactionSuccessful(transactionData: any) {
  try {
    console.log('Transaction successful:', transactionData);
    // This will be handled in the webhook route with Supabase updates
  } catch (error) {
    console.error('Error handling transaction successful:', error);
    throw error;
  }
}

// Main Webhook Handler
export async function handlePaymobWebhook(
  body: string,
  signature: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      return { success: false, message: 'Invalid webhook signature' };
    }

    const event: PaymobWebhookEvent = JSON.parse(body);
    const { type, obj } = event;

    console.log('Webhook event received:', type);

    switch (type) {
      case 'TRANSACTION':
        if (obj.success) {
          await handleTransactionSuccessful(obj);
        }
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(obj);
        break;
      case 'subscription.updated':
        await handleSubscriptionUpdated(obj);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(obj);
        break;
      default:
        console.log('Unhandled webhook event:', type);
    }

    return { success: true, message: 'Webhook processed successfully' };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { success: false, message: 'Error processing webhook' };
  }
}
