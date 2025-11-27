import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Handle hash fragment redirects (common with OAuth providers)
  const url = new URL(request.url)
  const hash = url.hash || ''

}

// Check if profile exists, create if not
const user = data.user
if (user) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile && !profileError) {
    // Enhanced profile creation with Google data
    const fullName = user.user_metadata.full_name ||
      user.user_metadata.name ||
      user.email?.split('@')[0] ||
      'Unknown'

    const avatarUrl = user.user_metadata.avatar_url ||
      user.user_metadata.picture ||
      null

    const { error: insertError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      age: user.user_metadata.age || null,
      gender: user.user_metadata.gender || 'prefer-not-to-say',
      country: user.user_metadata.country || 'Unknown',
      use_case: user.user_metadata.use_case || 'other',
      avatar_url: avatarUrl,
      email: user.email || '',
      plan: 'free',
      preferences: { theme: 'dark', notifications: true, newsletter: true, language: 'en' },
      statistics: { canvases_created: 0, last_login: null, total_exports: 0, favorite_colors: [] }
    })

    if (insertError) {
      console.error('Error creating profile:', insertError)
    } else {
      console.log('Profile created successfully for user:', user.id)
    }
  } else if (profile && !profileError) {
    // Update existing profile with latest Google data
    const updates: any = {}

    if (user.user_metadata.full_name && profile.full_name !== user.user_metadata.full_name) {
      updates.full_name = user.user_metadata.full_name
    }

    if (user.user_metadata.avatar_url && profile.avatar_url !== user.user_metadata.avatar_url) {
      updates.avatar_url = user.user_metadata.avatar_url
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
      }
    }
  }
}

return NextResponse.redirect(`${origin}${next}`)
    } catch (error) {
  console.error('Unexpected error in auth callback:', error)
  return NextResponse.redirect(`${origin}/login?error=unexpected_error`)
}
  }

return NextResponse.redirect(`${origin}/login?error=no_code`)
}