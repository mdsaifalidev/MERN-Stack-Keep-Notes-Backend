import { Router } from "express";
import * as Auth from "../controller/Auth.js";
import protect from "../middlewares/Auth.js";
import validate from "../middlewares/Validate.js";
import * as Validator from "../validators/Auth.js";

const router = Router();

router
  .post("/signup", validate(Validator.signupSchema), Auth.createUser)
  .post("/login", validate(Validator.loginSchema), Auth.loginUser)
  .post("/logout", Auth.logoutUser)
  .post("/check", protect, Auth.checkAuth)
  .post(
    "/reset-password-request",
    validate(Validator.resetPasswordRequestSchema),
    Auth.resetPasswordRequest
  )
  .post(
    "/reset-password/:token",
    validate(Validator.resetPasswordSchema),
    Auth.resetPassword
  );

export default router;
