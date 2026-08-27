import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(12, "Password must be at least 12 characters.").regex(/[A-Z]/, "Password must include an uppercase letter.").regex(/[a-z]/, "Password must include a lowercase letter.").regex(/[0-9]/, "Password must include a number.").regex(/[^A-Za-z0-9]/, "Password must include a special character."),
});
export const signinSchema = z.object({ email: z.email().transform((value) => value.toLowerCase()), password: z.string().min(1) });
export const accountUpdateSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(80).optional(),
  preferences: z.object({ orderUpdates: z.boolean(), productNews: z.boolean(), compactDashboard: z.boolean() }).optional(),
}).refine((value) => value.name !== undefined || value.preferences !== undefined, "No account changes supplied.");

export const checkoutSchema = z.object({
  customer: z.object({ name: z.string().trim().min(2), email: z.email(), phone: z.string().trim().min(7) }),
  delivery: z.object({ address: z.string().trim().min(5), city: z.string().trim().min(2), state: z.string().trim().min(2), country: z.string().trim().min(2) }),
  paymentMethod: z.enum(["balance", "simulated-card"]),
  promoCode: z.string().nullable().optional(),
  items: z.array(z.object({ slug: z.string(), quantity: z.number().int().positive() })).min(1),
  idempotencyKey: z.string().min(10),
});
