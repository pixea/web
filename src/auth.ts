import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/index";
import Resend from "next-auth/providers/resend";
import { resendConfig } from "./emails/magic";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Resend(resendConfig)],
  pages: {
    signIn: "/en/auth",
    signOut: "/en/auth",
    error: "/en/auth",
    verifyRequest: "/en/auth/verify",
    newUser: "/en/auth",
  },
});
