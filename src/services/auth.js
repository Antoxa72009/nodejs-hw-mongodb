import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { signAccessToken, signRefreshToken } from "../utils/token.js";

const ACCESS_TTL_MS = 15 * 60 * 1000; 
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; 

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw createHttpError(409, "Email in use");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createHttpError(401, "Invalid credentials");

  await Session.deleteMany({ userId: user._id });

  const accessToken = signAccessToken({ _id: user._id, email: user.email });
  const refreshToken = signRefreshToken({ _id: user._id, email: user.email });

  const now = Date.now();
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_TTL_MS),
    refreshTokenValidUntil: new Date(now + REFRESH_TTL_MS),
  });

  return {
    accessToken,
    refreshToken,
    user: { _id: user._id, name: user.name, email: user.email },
  };
};

export const refreshSession = async (currentRefreshToken) => {
  const oldSession = await Session.findOne({ refreshToken: currentRefreshToken });
  if (!oldSession) throw createHttpError(401, "Invalid session");

  await Session.deleteOne({ _id: oldSession._id });

  const payload = { _id: oldSession.userId.toString() };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const now = Date.now();

  await Session.create({
    userId: oldSession.userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_TTL_MS),
    refreshTokenValidUntil: new Date(now + REFRESH_TTL_MS),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const logoutSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(401, "Invalid session");

  await Session.deleteOne({ _id: session._id });
  return true;
};

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const updateUserPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, "User not found!");

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  return user;
};