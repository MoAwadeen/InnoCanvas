import { NextRequest, NextResponse } from 'next/server';
import { LemonSqueezyService } from '@/lib/lemonsqueezy';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscriptionId = parseInt(params.id);

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Invalid subscription ID' },
        { status: 400 }
      );
    }

    // Get user session
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

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user owns this subscription
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_id')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile || profile.subscription_id !== subscriptionId.toString()) {
      return NextResponse.json(
        { error: 'Subscription not found or access denied' },
        { status: 403 }
      );
    }

    // Get subscription details from LemonSqueezy
    const subscription = await LemonSqueezyService.getSubscription(subscriptionId);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        status_formatted: subscription.status_formatted,
        card_brand: subscription.card_brand,
        card_last_four: subscription.card_last_four,
        renews_at: subscription.renews_at,
        ends_at: subscription.ends_at,
        cancelled: subscription.cancelled,
        product_name: subscription.product_name,
        variant_name: subscription.variant_name,
      },
    });
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription details' },
      { status: 500 }
    );
  }
}
