import Joi from "joi";

export const createAuthSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const sendResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPwdSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});