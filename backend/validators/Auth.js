import { z } from "zod";

const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(4, { message: "Name must be at least of 4 characters" })
    .max(255, { message: "Name must not be more than 255 characters." }),
  email: z
    .string({ required_error: "Email address is required." })
    .trim()
    .email({ message: "Invalid email address." })
    .max(255, { message: "Email must not be more than 255 characters." }),
  phone: z
    .string({ required_error: "Phone number is required." })
    .trim()
    .min(10, { message: "Phone number must be at least of 10 characters." })
    .max(20, { message: "Phone number must not be more than 20 characters." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least of 6 characters." })
    .max(255, "Password can't be greater than 255 characters."),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .trim()
    .email({ message: "Invalid email address." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least of 6 characters." }),
});

const resetPasswordRequestSchema = z.object({
  email: z
    .string({ required_error: "Email address is required." })
    .trim()
    .email({ message: "Invalid email address." }),
});

const resetPasswordSchema = z.object({
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least of 6 characters." })
    .max(255, "Password can't be greater than 255 characters."),
});

export {
  signupSchema,
  loginSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
};
