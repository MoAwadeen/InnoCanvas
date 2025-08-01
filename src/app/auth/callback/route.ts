import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/my-canvases'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.delete({ name, ...options })
            },
          },
        }
    )
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    // Check if profile exists, create if not
    const user = data.user
    if (user) {
      const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

      if (!profile && !profileError) {
        const fullName = user.user_metadata.full_name || user.email?.split('@')[0] || 'Unknown'
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          full_name: fullName,
          age: user.user_metadata.age || null,
          gender: user.user_metadata.gender || 'prefer-not-to-say',
          country: user.user_metadata.country || 'Unknown',
          use_case: user.user_metadata.use_case || 'other',
        })
        
        if (insertError) {
          console.error('Error creating profile:', insertError)
        }
      }
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}