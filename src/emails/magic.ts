import { EmailUserConfig } from "next-auth/providers";
import { randomBytes } from "node:crypto";
import { CrockfordBase32 } from "crockford-base32";

import VerificationEmail from "../../emails/verification";
import { resend } from ".";
import { getLocale } from "next-intl/server";
import messages from "../../messages";
import { Locales } from "@/i18n/locales";

const from = "Pixea <no-reply@pixea.sk>";

export const resendConfig: EmailUserConfig = {
  from,
  generateVerificationToken: () => CrockfordBase32.encode(randomBytes(5)),
  maxAge: 60 * 60 * 1,
  sendVerificationRequest: async (params) => {
    const locale = (await getLocale()) as Locales;

    const subject = messages[locale].VerificationEmail.subject;

    const { identifier: to, token } = params;

    const res = await resend.emails.send({
      from,
      to,
      subject,
      react: VerificationEmail({ code: token, locale }),
    });

    if (res.error)
      throw new Error("Resend error: " + JSON.stringify(res.error));
  },
};
