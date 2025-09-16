import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import User from "../models/user.js"; 

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw createHttpError(401, "No token provided");

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) throw createHttpError(404, "User not found");

    req.user = user; 
    next();
  } catch (err) {
    next(err);
  }
};