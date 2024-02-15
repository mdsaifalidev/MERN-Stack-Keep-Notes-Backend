import User from "../model/User.js";

const fetchUser = async (req, res) => {
  try {
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
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const id = req.user._id;

    await User.findByIdAndUpdate(id, { name, email, phone }, { new: true });
    return res.status(200).json({
      success: true,
      message: "You profile has been updated successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const updateUserPassword = async (req, res) => {
  try {
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
      return res
        .status(500)
        .json({ success: false, message: "Invalid old password." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export { fetchUser, updateUser, updateUserPassword };
