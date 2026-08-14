import { StoredCredential } from "./types";

/**
 * Hardcoded demo accounts for the frontend-only showcase.
 * These are intentionally public — see the "Demo Accounts" panel on /login.
 */
export const DEMO_USERS: StoredCredential[] = [
  {
    id: "demo-admin",
    name: "Admin",
    email: "admin@dronai.demo",
    password: "Admin@123",
    role: "admin",
  },
  {
    id: "demo-pilot",
    name: "Pilot Operator",
    email: "pilot@dronai.demo",
    password: "Pilot@123",
    role: "pilot",
  },
  {
    id: "demo-user",
    name: "Farm User",
    email: "user@dronai.demo",
    password: "User@123",
    role: "user",
  },
];

export const DEMO_ACCOUNTS_TABLE = DEMO_USERS.map((u) => ({
  role: u.role,
  email: u.email,
  password: u.password,
}));
