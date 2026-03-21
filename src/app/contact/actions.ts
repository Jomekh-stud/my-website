"use server";

import { z } from "zod";
import { sendSiteContactEmail } from "@/lib/send-email";

const siteContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(20).optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(120),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type SiteContactState = {
  success: boolean;
  message: string;
} | null;

export async function submitSiteContactForm(
  _prevState: SiteContactState,
  formData: FormData,
): Promise<SiteContactState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const result = siteContactSchema.safeParse(raw);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return { success: false, message: firstIssue.message };
  }

  try {
    await sendSiteContactEmail(result.data);
    return {
      success: true,
      message: "Thanks! Your message has been sent. I'll get back to you soon.",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong sending your message. Please try again.",
    };
  }
}
