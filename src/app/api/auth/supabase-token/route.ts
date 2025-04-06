import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSession } from '@auth0/nextjs-auth0';
import { createHash } from 'crypto';

export async function GET() {
  try {
    console.log("Supabase token endpoint called");
    const session = await getSession();
    
    // Check if user is authenticated with Auth0
    if (!session?.user) {
      console.log("No Auth0 session found");
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    console.log("Auth0 session found for user:", session.user.email);

    // Initialize Supabase admin client
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create a simpler approach - create a user in Supabase if they don't exist
    try {
      // Check if the user exists in Supabase auth
      const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (getUserError) {
        console.error("Error listing users:", getUserError);
        return NextResponse.json({ error: 'Failed to check existing users' }, { status: 500 });
      }
      
      const existingUser = users.find(u => u.email === session.user.email);
      console.log("User exists in Supabase auth:", !!existingUser);
      
      let userId;
      let userEmail = session.user.email!;
      const password = createHash('sha256').update(session.user.sub + Date.now()).digest('hex');
      
      if (!existingUser) {
        // Create a new user in Supabase auth
        console.log("Creating new user in Supabase auth");
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userEmail,
          email_confirm: true,
          password: password,
          user_metadata: {
            auth0_id: session.user.sub,
            name: session.user.name || session.user.email?.split('@')[0] || 'User'
          }
        });
        
        if (createError) {
          console.error("Error creating user:", createError);
          return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }
        
        userId = newUser.user.id;
        console.log("Created new user with ID:", userId);
      } else {
        userId = existingUser.id;
        userEmail = existingUser.email;
        console.log("Using existing user with ID:", userId);
        
        // Update user metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...existingUser.user_metadata,
            auth0_id: session.user.sub,
            name: session.user.name || existingUser.user_metadata?.name || 'User'
          },
          password: password
        });
        
        if (updateError) {
          console.error("Error updating user metadata:", updateError);
        } else {
          console.log("Updated user metadata");
        }
      }
      
      // Generate a new session for the user by signing in with email/password
      console.log("Generating session for user");
      
      // First, create a regular Supabase client to sign in
      const regularClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Sign in with the email and password
      const { data: signInData, error: signInError } = await regularClient.auth.signInWithPassword({
        email: userEmail,
        password: password
      });
      
      if (signInError || !signInData.session) {
        console.error("Error signing in user:", signInError);
        return NextResponse.json({ error: 'Failed to generate session' }, { status: 500 });
      }
      
      console.log("Successfully generated session");
      
      // Return the session tokens
      return NextResponse.json({
        access_token: signInData.session.access_token,
        refresh_token: signInData.session.refresh_token,
        expires_at: Math.floor(signInData.session.expires_at ? new Date(signInData.session.expires_at).getTime() / 1000 : (Date.now() / 1000) + 3600)
      });
    } catch (error) {
      console.error("Error in token generation:", error);
      return NextResponse.json({ 
        error: 'Failed to generate token: ' + (error instanceof Error ? error.message : String(error)) 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in supabase-token route:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) 
    }, { status: 500 });
  }
}
