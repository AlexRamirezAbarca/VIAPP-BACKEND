import { Joi } from "express-validation";

export const newRequests = {
    body: Joi.object({
        name_request: Joi.string().trim().required().messages({
            'string.empty': 'El nombre de la solicitud no debe estar vacía.',
            'any.required': 'El nombre de la solicitud es un campo requerido.',
          }),
          description_request: Joi.string().trim().required().messages({
            'string.empty': 'La descripcion de la solicitud no debe estar vacía.',
            'any.required': 'La descripcion de la solicitud es un campo requerido.',
          }),
    })
};

export const updateRequest = {
  body: Joi.object({
    request_id: Joi.number().required(),
    status_id_request: Joi.number().required(),
    description: Joi.string().allow(null)
  })
};


export const updateTypeRequest = {
  body: Joi.object({
    request_type_id: Joi.number().integer().min(1).required(),
    // .messages({
    //   "number.base": "El id del usuario debe ser un número.",
    //   "number.min": "El id del usuario debe ser mayor a 0.",
    //   "any.required": "El id del usuario es un campo requerido.",
    // }),
    status: Joi.number().valid(0, 1).required()
    //.messages({
    //   "number.base": "El estado del usuario debe ser un número.",
    //   "any.only": "El estado del usuario debe ser 0 o 1.",
    //   "any.required": "El estado del usuario es un campo requerido.",
    // }),
  }),
};