import { Router } from "express";
import * as User from "../controller/User.js";

const router = Router();

router.route("/profile").get(User.fetchUser).put(User.updateUser);
router.route("/update-password").put(User.updateUserPassword);

export default router;
