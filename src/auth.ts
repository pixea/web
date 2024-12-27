import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/db/index";
import Resend from "next-auth/providers/resend";
import { resendConfig } from "./emails/magic";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [Resend(resendConfig)],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
});
