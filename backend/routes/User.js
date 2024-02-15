import { Router } from "express";
import * as User from "../controller/User.js";
import validate from "../middlewares/Validate.js";
import * as Validator from "../validators/User.js";

const router = Router();

router
  .route("/profile")
  .get(User.fetchUser)
  .put(validate(Validator.updateProfileSchema), User.updateUser);
router
  .route("/update-password")
  .put(validate(Validator.updateProfileSchema), User.updateUserPassword);

export default router;
