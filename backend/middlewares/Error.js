import CustomError from "../utils/CustomError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.status).json({ message: err.message });
  } else {
    //console.error(err.stack);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export default errorHandler;
