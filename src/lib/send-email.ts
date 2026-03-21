import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailPayload = {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
};

type SiteEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(payload: EmailPayload) {
  const { name, email, phone, inquiryType, message } = payload;

  const { error } = await resend.emails.send({
    from: "Website Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL || "hello@johnqperforms.com",
    replyTo: email,
    subject: `New ${inquiryType} Inquiry from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Inquiry Type: ${inquiryType}`,
      `\nMessage:\n${message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendSiteContactEmail(payload: SiteEmailPayload) {
  const { name, email, phone, subject, message } = payload;

  const { error } = await resend.emails.send({
    from: "Website Contact <onboarding@resend.dev>",
    to: process.env.CONTACT_EMAIL || "hello@johnqperforms.com",
    replyTo: email,
    subject: `Site Contact: ${subject} (from ${name})`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      `Subject: ${subject}`,
      `\nMessage:\n${message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}
