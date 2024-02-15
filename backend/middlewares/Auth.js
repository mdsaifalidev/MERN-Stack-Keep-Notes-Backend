import User from "../model/User.js";
import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async function (err, decode) {
        if (err) {
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized, invalid token." });
        } else {
          req.user = await User.findById(decode.id).select("name email phone");
          return next();
        }
      });
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

export default protect;
