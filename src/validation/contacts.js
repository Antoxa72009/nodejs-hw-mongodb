import Joi from "joi";

const name = Joi.string().min(3).max(20);
const phoneNumber = Joi.string().min(3).max(20);
const email = Joi.string().email().max(50);
const isFavourite = Joi.boolean();
const contactType = Joi.string().valid("work", "home", "personal").required();

export const createContactSchema = Joi.object({
  name: name.required(),
  phoneNumber: phoneNumber.required(),
  email: email.optional(),
  isFavourite: isFavourite.optional(),
  contactType: contactType,
});

export const updateContactSchema = Joi.object({
  name: name.optional(),
  phoneNumber: phoneNumber.optional(),
  email: email.optional(),
  isFavourite: isFavourite.optional(),
  contactType: Joi.string().valid("work", "home", "personal").optional(),
}).min(1);