import { Resend } from "resend";

export const resend = new Resend(process.env.AUTH_RESEND_KEY!);
export const emailFrom = "Pixea <no-reply@pixea.sk>";
export const emailReplyTo = "Pixea <info@pixea.sk>";
