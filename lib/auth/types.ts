export type UserRole = "admin" | "pilot" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface StoredCredential extends AuthUser {
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";
