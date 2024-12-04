import { Resend } from "resend";

// RESEND CLIENT - SEND EMAILS USING RESEND API
export const resend = new Resend(process.env.RESEND_API_KEY);
