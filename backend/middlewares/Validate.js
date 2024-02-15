import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError.js";

const validate = (schema) =>
  asyncHandler(async (req, res, next) => {
    try {
      const parseBody = await schema.parseAsync(req.body);
      req.body = parseBody;
      return next();
    } catch (error) {
      const message = error.errors[0].message;
      throw new CustomError(message, 400);
    }
  });

export default validate;
