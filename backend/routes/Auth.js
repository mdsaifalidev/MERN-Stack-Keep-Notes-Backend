import { Router } from "express";
import * as Auth from "../controller/Auth.js";
import protect from "../middlewares/Auth.js";

const router = Router();

router
  .post("/signup", Auth.createUser)
  .post("/login", Auth.loginUser)
  .post("/logout", Auth.logoutUser)
  .post("/check", protect, Auth.checkAuth)
  .post("/reset-password-request", Auth.resetPasswordRequest)
  .post("/reset-password/:token", Auth.resetPassword);

export default router;
