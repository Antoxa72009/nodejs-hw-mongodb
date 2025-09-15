import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { Session } from "../models/session.js";
import { User } from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) throw createHttpError(401, "No access token");

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") throw createHttpError(401, "Access token expired");
      throw createHttpError(401, "Invalid access token");
    }

    const session = await Session.findOne({ userId: payload._id, accessToken: token });
    if (!session) throw createHttpError(401, "Invalid session");

    const user = await User.findById(payload._id).select("-password -__v");
    if (!user) throw createHttpError(401, "User not found");

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    next(err);
  }
};