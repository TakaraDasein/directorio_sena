import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`)
    }

    // Si es un reset de contraseña, redirigir a la página de reset
    if (type === 'recovery' || type === 'magiclink') {
      return NextResponse.redirect(`${origin}/auth/reset-password`)
    }

    // Verificar si el usuario ya tiene una empresa
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: companies } = await supabase
        .from('companies')
        .select('id, slug')
        .eq('user_id', user.id)
        .limit(1)

      if (companies && companies.length > 0) {
        // Usuario ya tiene empresa, redirigir al admin
        return NextResponse.redirect(`${origin}/admin`)
      }
    }
  }

  // URL to redirect to after sign in process completes
  // Usuario nuevo o sin empresa, redirigir al flujo de configuración
  return NextResponse.redirect(`${origin}/company-name`)
}
