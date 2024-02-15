import User from "../model/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Email.js";

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email address already exists." });
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number already exists." });
    }

    const user = await User.create({ name, email, phone, password });
    return res.status(201).json({
      success: true,
      message: "Your account has been created successfully.",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const loginUser = async (req, res) => {
  try {
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken", { path: "/" });

    return res
      .status(200)
      .json({ success: true, message: "You have logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const checkAuth = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({ success: true, user: req.user });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
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
        message:
          "Reset password link has been successfully sent in your email.",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "User not found." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = req.params.token;
    const password = req.body.password;

    const user = await User.findOne({ resetPasswordToken });
    if (user) {
      jwt.verify(
        resetPasswordToken,
        process.env.JWT_SECRET,
        async function (err, decode) {
          if (err) {
            return res.status(401).json({
              success: false,
              message: "Unauthorized, invalid token.",
            });
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
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, no token." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export {
  createUser,
  loginUser,
  logoutUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
};
