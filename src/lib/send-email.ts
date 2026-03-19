import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailPayload = {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
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
