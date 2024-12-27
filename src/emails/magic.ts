import { EmailUserConfig } from "next-auth/providers";
import { randomBytes } from "node:crypto";
import { CrockfordBase32 } from "crockford-base32";

export const resendConfig: EmailUserConfig = {
  from: "no-reply@pixea.sk",
  generateVerificationToken: () => CrockfordBase32.encode(randomBytes(5)),
};
