import { NextRequest, NextResponse } from 'next/server';
import { PaymobService } from '@/lib/paymob';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        // Get the request body
        const { planId, userEmail, userName, userPhone } = await request.json();

        // Validate required fields
        if (!planId) {
            return NextResponse.json(
                { error: 'Missing required field: planId' },
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

        // Create subscription with Paymob
        const subscription = await PaymobService.createSubscription({
            planId: parseInt(planId),
            customerEmail: userEmail || session.user.email!,
            customerName: userName || session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            customerPhone: userPhone,
            successUrl: `${process.env.NEXTAUTH_URL}/payment/success`,
            failureUrl: `${process.env.NEXTAUTH_URL}/payment?error=payment_failed`,
        });

        return NextResponse.json({
            success: true,
            subscription: {
                id: subscription.subscription_id,
                payment_url: subscription.payment_url,
            },
        });
    } catch (error) {
        console.error('Checkout creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
