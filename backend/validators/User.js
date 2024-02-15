import { z } from "zod";

const updateProfileSchema = z.object({
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
});

const updatePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: "Old Password is required." })
    .min(6, { message: "Old Password must be at least of 6 characters." }),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, { message: "Password must be at least of 6 characters." })
    .max(255, "Password can't be greater than 255 characters."),
});

export { updateProfileSchema, updatePasswordSchema };
