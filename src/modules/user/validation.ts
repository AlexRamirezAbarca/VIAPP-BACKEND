import { Joi } from "express-validation";

export const updateUser = {
  body: Joi.object({
    user_id: Joi.number().integer().min(1).required().messages({
      "number.base": "El id del usuario debe ser un número.",
      "number.min": "El id del usuario debe ser mayor a 0.",
      "any.required": "El id del usuario es un campo requerido.",
    }),
    status: Joi.number().valid(0, 1).required().messages({
      "number.base": "El estado del usuario debe ser un número.",
      "any.only": "El estado del usuario debe ser 0 o 1.",
      "any.required": "El estado del usuario es un campo requerido.",
    }),
  }),
};
