import NextAuth, { DefaultSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/index";
import Resend from "next-auth/providers/resend";
import { resendConfig } from "./emails/magic";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "./db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "customer" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "customer" | "admin";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
    authenticatorsTable: authenticators,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Resend(resendConfig)],
  pages: {
    signIn: "/auth",
    signOut: "/auth",
    error: "/auth",
    verifyRequest: "/auth/verify",
    newUser: "/auth",
  },
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role;
      return session;
    },
  },
});
