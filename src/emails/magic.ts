import { EmailUserConfig } from "next-auth/providers";
import { randomBytes } from "node:crypto";
import { CrockfordBase32 } from "crockford-base32";
import VerificationEmail from "../../emails/verification";
// import { getLocale } from "next-intl/server";

export const resendConfig: EmailUserConfig = {
  from: "Pixea <no-reply@pixea.sk>",
  generateVerificationToken: () => CrockfordBase32.encode(randomBytes(5)),
  sendVerificationRequest: async (params) => {
    // const locale = await getLocale();

    const { identifier: to, provider, token } = params;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: provider.from,
        to,
        subject: "Sign in to Pixea",
        react: VerificationEmail({ code: token }),
      }),
    });

    if (!res.ok)
      throw new Error("Resend error: " + JSON.stringify(await res.json()));
  },
};

// /api/auth/callback/resend?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fsk%2Fauth&token=B989ZG3G&email=jakub%40duras.me
