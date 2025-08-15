import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AdminAuthRequest {
  email: string
  password: string
  ip_address: string
  user_agent?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, ip_address, user_agent } = await req.json() as AdminAuthRequest

    console.log(`Admin login attempt from IP: ${ip_address}`)

    // Check rate limiting - max 5 attempts per IP per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data: recentAttempts, error: attemptsError } = await supabase
      .from('admin_login_attempts')
      .select('id')
      .eq('ip_address', ip_address)
      .gte('created_at', oneHourAgo)

    if (attemptsError) {
      console.error('Error checking login attempts:', attemptsError)
      throw new Error('Rate limiting check failed')
    }

    if (recentAttempts && recentAttempts.length >= 5) {
      console.log(`Rate limit exceeded for IP: ${ip_address}`)
      
      // Log failed attempt
      await supabase
        .from('admin_login_attempts')
        .insert({
          ip_address,
          user_agent,
          success: false
        })

      return new Response(
        JSON.stringify({ 
          error: 'Too many login attempts. Please try again later.',
          code: 'RATE_LIMITED'
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Attempt authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // Log the attempt regardless of success
    await supabase
      .from('admin_login_attempts')
      .insert({
        ip_address,
        user_agent,
        success: !authError
      })

    if (authError) {
      console.log(`Failed login attempt for ${email}: ${authError.message}`)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed',
          code: 'AUTH_FAILED'
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .single()

    if (adminError || !adminUser) {
      console.log(`Non-admin user attempted access: ${email}`)
      return new Response(
        JSON.stringify({ 
          error: 'Access denied. Admin privileges required.',
          code: 'ACCESS_DENIED'
        }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check IP whitelisting if configured
    if (adminUser.allowed_ips && adminUser.allowed_ips.length > 0) {
      if (!adminUser.allowed_ips.includes(ip_address)) {
        console.log(`IP not whitelisted for admin ${email}: ${ip_address}`)
        return new Response(
          JSON.stringify({ 
            error: 'Access denied from this IP address.',
            code: 'IP_NOT_ALLOWED'
          }),
          { 
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Update last login time
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminUser.id)

    console.log(`Successful admin login: ${email}`)

    return new Response(
      JSON.stringify({ 
        user: authData.user,
        session: authData.session,
        admin_data: adminUser
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})