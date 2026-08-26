import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email address.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").regex(/[A-Za-z]/, "Password must include a letter.").regex(/[0-9]/, "Password must include a number."),
});
export const signinSchema = z.object({ email: z.email().transform((value) => value.toLowerCase()), password: z.string().min(1) });

export const checkoutSchema = z.object({
  customer: z.object({ name: z.string().trim().min(2), email: z.email(), phone: z.string().trim().min(7) }),
  delivery: z.object({ address: z.string().trim().min(5), city: z.string().trim().min(2), state: z.string().trim().min(2), country: z.string().trim().min(2) }),
  paymentMethod: z.enum(["balance", "simulated-card"]),
  promoCode: z.string().nullable().optional(),
  items: z.array(z.object({ slug: z.string(), quantity: z.number().int().positive() })).min(1),
  idempotencyKey: z.string().min(10),
});
