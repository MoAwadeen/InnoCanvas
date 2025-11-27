import { NextRequest, NextResponse } from 'next/server';
import { PaymobService } from '@/lib/paymob';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const subscriptionId = parseInt(id);

        if (isNaN(subscriptionId)) {
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
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_id')
            .eq('id', session.user.id)
            .single();

        if (!profile || profile.subscription_id !== id) {
            return NextResponse.json(
                { error: 'Subscription not found or access denied' },
                { status: 404 }
            );
        }

        // Get subscription details from Paymob
        const subscription = await PaymobService.getSubscription(subscriptionId);

        return NextResponse.json({
            success: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                plan_id: subscription.plan_id,
                next_billing_date: subscription.next_billing_date,
                start_date: subscription.start_date,
                end_date: subscription.end_date,
            },
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscription details' },
            { status: 500 }
        );
    }
}
