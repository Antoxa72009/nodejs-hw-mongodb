import createHttpError from "http-errors";
import { registerUser, loginUser, refreshSession, logoutSession } from "../services/auth.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: 200,
      message: "Successfully logged in an user!",
      data: { accessToken: result.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) throw createHttpError(401, "No refresh token");

    const result = await refreshSession(refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken: result.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};
    if (!refreshToken) throw createHttpError(401, "No refresh token");

    await logoutSession(refreshToken);

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getProfileController = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) throw createHttpError(404, "User not found");

    res.json({
      status: 200,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};