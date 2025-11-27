import { NextRequest, NextResponse } from 'next/server';
import { handlePaymobWebhook } from '@/lib/paymob';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('hmac') || '';

        // Handle the webhook
        const result = await handlePaymobWebhook(body, signature);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        // Parse the webhook data
        const event = JSON.parse(body);
        const { type, obj } = event;

        // Get Supabase client (using service role for webhook operations)
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return '';
                    },
                    set(name: string, value: string, options: any) {
                        // No-op for webhooks
                    },
                    remove(name: string, options: any) {
                        // No-op for webhooks
                    },
                },
            }
        );

        // Handle different webhook events
        switch (type) {
            case 'TRANSACTION':
                if (obj.success && obj.subscription) {
                    await handleSubscriptionTransaction(supabase, obj);
                }
                break;
            case 'subscription.created':
                await handleSubscriptionCreated(supabase, obj);
                break;
            case 'subscription.updated':
                await handleSubscriptionUpdated(supabase, obj);
                break;
            case 'subscription.cancelled':
                await handleSubscriptionCancelled(supabase, obj);
                break;
            default:
                console.log(`Unhandled event: ${type}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

// Webhook event handlers
async function handleSubscriptionTransaction(supabase: any, data: any) {
    console.log('Subscription transaction:', data);

    const subscription = data.subscription;
    const order = data.order;

    // Extract customer email from order or billing data
    const customerEmail = order.shipping_data?.email || order.billing_data?.email;

    if (!customerEmail) {
        console.error('No customer email found in transaction');
        return;
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, plan')
        .eq('email', customerEmail)
        .single();

    if (userError || !user) {
        console.error('User not found:', customerEmail);
        return;
    }

    // Determine plan based on subscription plan ID
    let newPlan = 'free';
    const planId = subscription.plan_id;

    if (planId === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PRO_PLAN_ID || '0')) {
        newPlan = 'pro';
    } else if (planId === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PREMIUM_PLAN_ID || '0')) {
        newPlan = 'premium';
    }

    // Update user's subscription
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            plan: newPlan,
            subscription_id: subscription.id.toString(),
            payment_provider: 'paymob',
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating user subscription:', updateError);
    } else {
        console.log(`Updated user ${user.id} subscription to ${newPlan} plan`);
    }
}

async function handleSubscriptionCreated(supabase: any, data: any) {
    console.log('Subscription created:', data);

    const { id: subscription_id, plan_id, billing_data } = data;
    const customerEmail = billing_data?.email;

    if (!customerEmail) {
        console.error('No customer email found');
        return;
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, plan')
        .eq('email', customerEmail)
        .single();

    if (userError || !user) {
        console.error('User not found:', customerEmail);
        return;
    }

    // Determine plan based on plan ID
    let newPlan = 'free';
    if (plan_id === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PRO_PLAN_ID || '0')) {
        newPlan = 'pro';
    } else if (plan_id === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PREMIUM_PLAN_ID || '0')) {
        newPlan = 'premium';
    }

    // Update user's subscription
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            plan: newPlan,
            subscription_id: subscription_id.toString(),
            payment_provider: 'paymob',
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating user subscription:', updateError);
    } else {
        console.log(`Created subscription for user ${user.id} with ${newPlan} plan`);
    }
}

async function handleSubscriptionUpdated(supabase: any, data: any) {
    console.log('Subscription updated:', data);

    const { id: subscription_id, plan_id, status, billing_data } = data;
    const customerEmail = billing_data?.email;

    if (!customerEmail) {
        console.error('No customer email found');
        return;
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, plan')
        .eq('email', customerEmail)
        .single();

    if (userError || !user) {
        console.error('User not found:', customerEmail);
        return;
    }

    // If subscription is cancelled or expired, downgrade to free
    if (status === 'cancelled' || status === 'expired') {
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                plan: 'free',
                subscription_id: null,
                payment_provider: 'paymob',
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error downgrading user:', updateError);
        } else {
            console.log(`Downgraded user ${user.id} to free plan`);
        }
        return;
    }

    // Determine plan based on plan ID
    let newPlan = 'free';
    if (plan_id === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PRO_PLAN_ID || '0')) {
        newPlan = 'pro';
    } else if (plan_id === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PREMIUM_PLAN_ID || '0')) {
        newPlan = 'premium';
    }

    // Update user's subscription
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            plan: newPlan,
            subscription_id: subscription_id.toString(),
            payment_provider: 'paymob',
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating user subscription:', updateError);
    } else {
        console.log(`Updated user ${user.id} subscription to ${newPlan} plan`);
    }
}

async function handleSubscriptionCancelled(supabase: any, data: any) {
    console.log('Subscription cancelled:', data);

    const { billing_data } = data;
    const customerEmail = billing_data?.email;

    if (!customerEmail) {
        console.error('No customer email found');
        return;
    }

    // Find user by email
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('id, plan')
        .eq('email', customerEmail)
        .single();

    if (userError || !user) {
        console.error('User not found:', customerEmail);
        return;
    }

    // Downgrade user to free plan
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            plan: 'free',
            subscription_id: null,
            payment_provider: 'paymob',
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error downgrading user:', updateError);
    } else {
        console.log(`Downgraded user ${user.id} to free plan`);
    }
}
