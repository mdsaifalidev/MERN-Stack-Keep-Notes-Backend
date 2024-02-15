import User from "../model/User.js";
import CustomError from "../utils/CustomError.js";
import asyncHandler from "express-async-handler";

const fetchUser = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const user = await User.findById(id).select("-password");
  return res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const id = req.user._id;

  await User.findByIdAndUpdate(id, { name, email, phone }, { new: true });
  return res.status(200).json({
    success: true,
    message: "You profile has been updated successfully.",
  });
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const { oldPassword, password } = req.body;
  const user = await User.findById(id);
  if (await user.verifyPassword(oldPassword)) {
    user.password = password;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Your password has been updated successfully.",
    });
  } else {
    throw new CustomError("Invalid old password.", 400);
  }
});

export { fetchUser, updateUser, updateUserPassword };
