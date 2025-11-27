import { NextRequest, NextResponse } from 'next/server';
import { PaymobService } from '@/lib/paymob';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(
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

        // Resume subscription in Paymob
        const resumedSubscription = await PaymobService.resumeSubscription(subscriptionId);

        // Get the plan from the resumed subscription
        let newPlan = 'free';
        const planId = resumedSubscription.plan_id;

        if (planId === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PRO_PLAN_ID || '0')) {
            newPlan = 'pro';
        } else if (planId === parseInt(process.env.NEXT_PUBLIC_PAYMOB_PREMIUM_PLAN_ID || '0')) {
            newPlan = 'premium';
        }

        // Update user's plan in database
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                plan: newPlan,
                subscription_id: id,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('Error updating user plan:', updateError);
        }

        return NextResponse.json({
            success: true,
            subscription: {
                id: resumedSubscription.id,
                status: resumedSubscription.status,
                plan: newPlan,
            },
        });
    } catch (error) {
        console.error('Error resuming subscription:', error);
        return NextResponse.json(
            { error: 'Failed to resume subscription' },
            { status: 500 }
        );
    }
}
