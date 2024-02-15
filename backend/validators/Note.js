import { z } from "zod";

const createNoteSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .trim()
    .min(4, { message: "Title must be at least of 4 characters" })
    .max(255, { message: "Title must not be more than 255 characters." }),
  description: z
    .string({ required_error: "Description is required." })
    .trim()
    .min(4, { message: "Description must be at least of 4 characters" })
    .max(255, { message: "Description must not be more than 255 characters." }),
});

const updateNoteSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .trim()
    .min(4, { message: "Title must be at least of 4 characters" })
    .max(255, { message: "Title must not be more than 255 characters." }),
  description: z
    .string({ required_error: "Description is required." })
    .trim()
    .min(4, { message: "Description must be at least of 4 characters" })
    .max(255, { message: "Description must not be more than 255 characters." }),
});

export { createNoteSchema, updateNoteSchema };
