import User from "../model/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "express-async-handler";

const createUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new CustomError("Email address already exists.", 404);
  }

  const phoneExists = await User.findOne({ phone });
  if (phoneExists) {
    throw new CustomError("Phone number already exists.", 404);
  }

  const user = await User.create({ name, email, phone, password });
  return res.status(201).json({
    success: true,
    message: "Your account has been created successfully.",
    user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.verifyPassword(password))) {
    const payload = { id: user._id, idAdmin: user.isAdmin };
    const token = user.generateToken(payload);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000),
    });

    return res
      .status(200)
      .json({ success: true, message: "You have logged in successfully." });
  } else {
    throw new CustomError("Invalid email or password.", 404);
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("authToken", { path: "/" });

  return res
    .status(200)
    .json({ success: true, message: "You have logged out successfully." });
});

const checkAuth = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.status(200).json({ success: true, user: req.user });
  } else {
    throw new CustomError("User not found.", 401);
  }
});

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const { TITLE, JWT_SECRET } = process.env;

  const user = await User.findOne({ email });
  if (user) {
    const payload = { id: user._id, idAdmin: user.isAdmin };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
    user.resetPasswordToken = token;
    await user.save();

    const resetPageLink = `http://localhost:8080/reset-password/${token}`;
    const subject = `${TITLE} - Reset password`;
    const html = `<h3>Reset password link is valid only for 30 minutes.</h3><p>Click <a href='${resetPageLink}'>here</a> to Reset password</p>`;
    await sendEmail(email, subject, html);

    return res.status(200).json({
      success: true,
      message: "Reset password link has been successfully sent in your email.",
    });
  } else {
    throw new CustomError("User not found.", 400);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = req.params.token;
  const password = req.body.password;

  const user = await User.findOne({ resetPasswordToken });
  if (user) {
    jwt.verify(
      resetPasswordToken,
      process.env.JWT_SECRET,
      async function (err, decode) {
        if (err) {
          throw new CustomError("Unauthorized, invalid token.", 401);
        } else {
          user.resetPasswordToken = null;
          user.password = password;
          await user.save();

          return res.status(200).json({
            success: true,
            message: "Your password has been updated successfully.",
          });
        }
      }
    );
  } else {
    throw new CustomError("Unauthorized, invalid token.", 401);
  }
});

export {
  createUser,
  loginUser,
  logoutUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
};
