import { NextRequest, NextResponse } from 'next/server';
import { handleLemonSqueezyWebhook } from '@/lib/lemonsqueezy';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature') || '';

    // Handle the webhook
    const result = await handleLemonSqueezyWebhook(body, signature);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    // Parse the webhook data
    const event = JSON.parse(body);
    const { event_name, data } = event;

    // Get Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Handle different webhook events
    switch (event_name) {
      case 'order_created':
        await handleOrderCreated(supabase, data);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(supabase, data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(supabase, data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(supabase, data);
        break;
      default:
        console.log(`Unhandled event: ${event_name}`);
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
async function handleOrderCreated(supabase: any, data: any) {
  console.log('Order created:', data);
  
  const { user_email, variant_id } = data;
  
  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id, plan')
    .eq('email', user_email)
    .single();

  if (userError || !user) {
    console.error('User not found:', user_email);
    return;
  }

  // Determine plan based on variant ID
  let newPlan = 'free';
  if (variant_id === parseInt(process.env.LEMON_SQUEEZY_PRO_VARIANT_ID || '0')) {
    newPlan = 'pro';
  } else if (variant_id === parseInt(process.env.LEMON_SQUEEZY_PREMIUM_VARIANT_ID || '0')) {
    newPlan = 'premium';
  }

  // Update user's plan
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      plan: newPlan,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating user plan:', updateError);
  } else {
    console.log(`Updated user ${user.id} to ${newPlan} plan`);
  }
}

async function handleSubscriptionCreated(supabase: any, data: any) {
  console.log('Subscription created:', data);
  
  const { user_email, variant_id, id: subscription_id } = data;
  
  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id, plan')
    .eq('email', user_email)
    .single();

  if (userError || !user) {
    console.error('User not found:', user_email);
    return;
  }

  // Determine plan based on variant ID
  let newPlan = 'free';
  if (variant_id === parseInt(process.env.LEMON_SQUEEZY_PRO_VARIANT_ID || '0')) {
    newPlan = 'pro';
  } else if (variant_id === parseInt(process.env.LEMON_SQUEEZY_PREMIUM_VARIANT_ID || '0')) {
    newPlan = 'premium';
  }

  // Update user's subscription
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      plan: newPlan,
      subscription_id: subscription_id.toString(),
      payment_provider: 'lemonsqueezy',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating user subscription:', updateError);
  } else {
    console.log(`Updated user ${user.id} subscription to ${newPlan} plan`);
  }
}

async function handleSubscriptionUpdated(supabase: any, data: any) {
  console.log('Subscription updated:', data);
  
  const { user_email, variant_id, id: subscription_id, status } = data;
  
  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id, plan')
    .eq('email', user_email)
    .single();

  if (userError || !user) {
    console.error('User not found:', user_email);
    return;
  }

  // Determine plan based on variant ID
  let newPlan = 'free';
  if (variant_id === parseInt(process.env.LEMON_SQUEEZY_PRO_VARIANT_ID || '0')) {
    newPlan = 'pro';
  } else if (variant_id === parseInt(process.env.LEMON_SQUEEZY_PREMIUM_VARIANT_ID || '0')) {
    newPlan = 'premium';
  }

  // Update user's subscription
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      plan: newPlan,
      subscription_id: subscription_id.toString(),
      payment_provider: 'lemonsqueezy',
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
  
  const { user_email } = data;
  
  // Find user by email
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id, plan')
    .eq('email', user_email)
    .single();

  if (userError || !user) {
    console.error('User not found:', user_email);
    return;
  }

  // Downgrade user to free plan
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ 
      plan: 'free',
      subscription_id: null,
      payment_provider: 'lemonsqueezy',
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error downgrading user:', updateError);
  } else {
    console.log(`Downgraded user ${user.id} to free plan`);
  }
}
