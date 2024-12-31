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
import { Address } from "./db/address";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "customer" | "admin";
      company?: string;
      companyId?: string;
      taxId?: string;
      vatId?: string;
      phone?: string;
      address?: Partial<Address>;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "customer" | "admin";
    company?: string;
    companyId?: string;
    taxId?: string;
    vatId?: string;
    phone?: string;
    address?: Partial<Address>;
  }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
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
      session.user.company = user.company;
      session.user.companyId = user.companyId;
      session.user.taxId = user.taxId;
      session.user.vatId = user.vatId;
      session.user.phone = user.phone;
      session.user.address = user.address;
      return session;
    },
  },
});
