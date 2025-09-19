import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { registerUser, loginUser, refreshSession, logoutSession, findUserByEmail, updateUserPassword } from "../services/auth.js";

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

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) throw createHttpError(404, "User not found!");

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "5m" });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch {
    next(createHttpError(500, "Failed to send the email, please try again later."));
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    const user = await findUserByEmail(payload.email);
    if (!user) throw createHttpError(404, "User not found!");

    const hashedPassword = await bcrypt.hash(password, 10);

    await updateUserPassword(user._id, hashedPassword);

    await logoutSession(user._id); 

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};