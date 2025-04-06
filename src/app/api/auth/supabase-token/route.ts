import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    // Check if user is authenticated with Auth0
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get or create user in Supabase
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth0_id', session.user.sub)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching user:", fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!existingUser) {
      // Create user in users table if they don't exist
      await supabaseAdmin.from('users').insert({
        auth0_id: session.user.sub,
        email: session.user.email,
        name: session.user.name || null,
        updated_at: new Date().toISOString(),
      });
    }

    // Sign in to Supabase as the user
    const { data: { user }, error: signInError } = await supabaseAdmin.auth.admin.createUser({
      email: session.user.email!,
      email_confirm: true,
      user_metadata: {
        auth0_id: session.user.sub,
        name: session.user.name
      }
    });

    if (signInError) {
      // If user already exists, generate a custom token instead
      if (signInError.message.includes('already exists')) {
        // Find the user by email
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        
        const matchedUser = usersData?.users?.find(
          user => user.email === session.user.email
        );
        
        if (!matchedUser?.id) {
          return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }
        
        // Create a new session for this user
        const { data: supabaseSession, error: tokenError } = 
          await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: session.user.email!
          });
          
        if (tokenError) {
          console.error("Token generation error:", tokenError);
          return NextResponse.json({ error: 'Token generation failed' }, { status: 500 });
        }

        return NextResponse.json({ 
          token: supabaseSession?.properties?.hashed_token,
          refresh_token: null,
          expires_at: null
        });
      }
      
      console.error("Sign in error:", signInError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }

    // Generate session for the user
    const { data: supabaseSession, error: sessionError } = 
      await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: user!.email!
      });
    if (sessionError) {
      console.error("Session creation error:", sessionError);
      return NextResponse.json({ error: 'Session creation failed' }, { status: 500 });
    }

    return NextResponse.json({ 
      token: supabaseSession?.properties?.hashed_token,
      refresh_token: null,
      expires_at: null
    });
  } catch (error) {
    console.error('Error in supabase-token route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
