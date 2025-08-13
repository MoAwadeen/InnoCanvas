import { NextRequest, NextResponse } from 'next/server';
import { LemonSqueezyService } from '@/lib/lemonsqueezy';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const { variantId, storeId, userEmail, userName } = await request.json();

    // Validate required fields
    if (!variantId || !storeId) {
      return NextResponse.json(
        { error: 'Missing required fields: variantId and storeId' },
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

    // Create checkout session
    const checkout = await LemonSqueezyService.createCheckoutSession({
      storeId: parseInt(storeId),
      variantId: parseInt(variantId),
      productOptions: {
        redirectUrl: `${process.env.NEXTAUTH_URL}/payment/success`,
        receiptButtonText: 'Access Your Account',
        receiptLinkUrl: `${process.env.NEXTAUTH_URL}/my-canvases`,
      },
      checkoutOptions: {
        embed: false,
        media: true,
        logo: true,
        desc: true,
        discount: true,
      },
      checkoutData: {
        email: userEmail || session.user.email,
        name: userName || session.user.user_metadata?.full_name,
        custom: {
          redirect_url: `${process.env.NEXTAUTH_URL}/payment/success`,
          receipt_button_text: 'Access Your Account',
          receipt_link_url: `${process.env.NEXTAUTH_URL}/my-canvases`,
        },
      },
    });

    return NextResponse.json({
      success: true,
      checkout: {
        url: (checkout as any).data?.attributes?.url || (checkout as any).url,
        id: (checkout as any).data?.id || (checkout as any).id,
        expires_at: (checkout as any).data?.attributes?.expires_at || (checkout as any).expires_at,
      },
    });
  } catch (error) {
    console.error('Checkout creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
