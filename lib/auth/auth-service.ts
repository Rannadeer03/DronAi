import { createClient } from "@/lib/supabase/client";
import { AuthUser, LoginInput, SignupInput } from "./types";

/**
 * Real Supabase-backed auth. Same function signatures as the earlier
 * frontend-only demo version — nothing that calls these needed to change.
 */

export async function loadAuthUser(userId: string, email: string): Promise<AuthUser> {
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    throw new Error("No profile found for this account.");
  }

  return {
    id: profile.id,
    name: profile.full_name || email,
    email,
    role: profile.role,
  };
}

export async function login({ email, password }: LoginInput): Promise<AuthUser> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw new Error("Invalid email or password.");
  }

  return loadAuthUser(data.user.id, data.user.email ?? email);
}

export async function signup({ name, email, password }: SignupInput): Promise<AuthUser> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data.session) {
    // signUp() returns a user record immediately even when email
    // confirmation is required — session stays null until confirmed, so
    // there's no authenticated context yet to read the profile with.
    throw new Error("Check your email to confirm your account, then sign in.");
  }

  return loadAuthUser(data.user!.id, data.user!.email ?? email);
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
