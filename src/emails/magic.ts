import { EmailUserConfig } from "next-auth/providers";
import { randomBytes } from "node:crypto";
import { CrockfordBase32 } from "crockford-base32";
import { getLocale } from "next-intl/server";
import { render } from "@react-email/render";

import { Locales } from "@/i18n/locales";

import VerificationEmail from "../../emails/verification";
import { resend } from ".";
import messages from "../../messages";

const from = "Pixea <no-reply@pixea.sk>";
const replyTo = "Pixea <info@pixea.sk>";

export const resendConfig: EmailUserConfig = {
  from,
  generateVerificationToken: () => CrockfordBase32.encode(randomBytes(5)),
  maxAge: 60 * 60 * 1,
  sendVerificationRequest: async (params) => {
    const locale = (await getLocale()) as Locales;

    const subject = messages[locale].VerificationEmail.subject;

    const { identifier: to, token } = params;

    const emailJSX = VerificationEmail({ code: token, locale });

    const res = await resend.emails.send({
      from,
      to,
      replyTo,
      subject,
      html: await render(emailJSX, { pretty: true }),
      text: await render(emailJSX, { plainText: true }),
    });

    if (res.error)
      throw new Error("Resend error: " + JSON.stringify(res.error));
  },
};
