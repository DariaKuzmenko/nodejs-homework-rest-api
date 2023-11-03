import { Schema, model } from "mongoose";

import Joi from "joi";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: String,
    phone: String,
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { versionKey: false }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": `'name' cannot be an empty field`,
    "any.required": `missing required 'name' field`,
  }),
  phone: Joi.string().required().messages({
    "string.empty": `'phone' cannot be an empty field`,
    "any.required": `missing required 'phone' field`,
  }),
  email: Joi.string().required().messages({
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
  favorite: Joi.boolean(),
});

export const contactUpdateFaroriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

export default Contact;
