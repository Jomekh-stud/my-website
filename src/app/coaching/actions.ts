"use server";

import { z } from "zod";
import { sendContactEmail } from "@/lib/send-email";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().max(20).optional(),
  inquiryType: z.enum(
    ["Private Coaching", "Group Class", "Workshop", "Other"],
    { message: "Please select an inquiry type" },
  ),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactState = {
  success: boolean;
  message: string;
} | null;

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    inquiryType: formData.get("inquiryType"),
    message: formData.get("message"),
  };

  const result = contactSchema.safeParse(raw);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return { success: false, message: firstIssue.message };
  }

  try {
    await sendContactEmail(result.data);
    return { success: true, message: "Thanks! Your message has been sent. I'll get back to you soon." };
  } catch {
    return { success: false, message: "Something went wrong sending your message. Please try again or email me directly." };
  }
}
