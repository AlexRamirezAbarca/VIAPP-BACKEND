import { Joi } from "express-validation";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
const textNumberRegex = /^[a-zA-Z0-9]+$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const cedulaRegex = /^[0-9]{10}$/;

function validarCedula(cedula) {
  if (!cedulaRegex.test(cedula)) {
    return false; // No cumple con el formato esperado
  }

  const digitoVerificador = parseInt(cedula.charAt(9), 10);
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula.charAt(i), 10);

    if (i % 2 === 0) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    suma += digito;
  }

  const resultado = (10 - (suma % 10)) % 10;

  return digitoVerificador === resultado;
}

export const login = {
  body: Joi.object({
    user_name: Joi.string().trim().required().messages({
      "string.empty": "El usuario no debe estar vacío.",
      "any.required": "El usuario es un campo requerido.",
    }),
    password: Joi.string().trim().min(6).required().messages({
      "string.empty": "La contraseña no debe estar vacío.",
      "string.min": "La contraseña debe tener al menos 6 caracteres.",
      "any.required": "La contraseña es un campo requerido.",
    }),
  }),
};

export const register = {
  body: Joi.object({
    first_name: Joi.string()
      .trim()
      .min(3)
      .required()
      .pattern(new RegExp(textRegex))
      .messages({
        "string.base": "El nombre debe ser una cadena de texto.",
        "string.empty": "El nombre no debe estar vacío.",
        "string.min": "El nombre debe tener al menos 3 caracter.",
        "any.required": "El nombre es un campo requerido.",
        "string.pattern.base": "El nombre solo puede contener letras.",
      }),
    last_name: Joi.string()
      .trim()
      .min(3)
      .required()
      .pattern(new RegExp(textRegex))
      .messages({
        "string.base": "El apellido debe ser una cadena de texto.",
        "string.empty": "El apellido no debe estar vacío.",
        "string.min": "El apellido debe tener al menos 3 caracter.",
        "any.required": "El apellido es un campo requerido.",
        "string.pattern.base": "El apellido solo puede contener letras.",
      }),
    email: Joi.string().trim().regex(emailRegex).email().required().messages({
      "string.pattern.base": "El correo debe ser válido.",
      "string.empty": "El correo no debe estar vacío.",
      "string.email": "El correo electrónico debe ser válido.",
      "any.required": "El correo electrónico es un campo requerido.",
    }),
    user_name: Joi.string()
      .trim()
      .required()
      .pattern(new RegExp(textNumberRegex))
      .messages({
        "string.base": "El usuario debe ser una cadena de texto.",
        "string.empty": "El usuario no debe estar vacío.",
        //'string.min': 'El nombre debe tener al menos 3 caracter.',
        "any.required": "El usuario es un campo requerido.",
        "string.pattern.base":
          "El usuario solo puede contener letras y números.",
      }),
    password: Joi.string()
      .trim()
      .required()
      .pattern(new RegExp(passwordRegex))
      .messages({
        "string.empty": "La contraseña no debe estar vacío.",
        //'string.min': 'La contraseña debe tener al menos 6 caracteres.',
        "any.required": "La contraseña es un campo requerido.",
        "string.pattern.base":
          "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un caracter especial y debe tener al menos 8 caracteres",
      }),
    // super_user: Joi.boolean().required().messages({
    //     'boolean.base': 'El super usuario debe ser un booleano.',
    //     'any.required': 'El super usuario es un campo requerido.',
    //     }),
    identification: Joi.string()
      .trim()
      .length(10)
      .pattern(new RegExp(cedulaRegex))
      .required()
      .messages({
        "string.base": "La cédula debe ser una cadena de caracteres.",
        "string.empty": "La cédula no debe estar vacía.",
        "string.length": "La cédula debe tener exactamente 10 dígitos.",
        "string.pattern.base": "La cédula solo debe contener dígitos (0-9).",
        "any.required": "La cédula es un campo obligatorio.",
      })
      .custom((value, helpers) => {
        if (!validarCedula(value)) {
          return helpers.message({ custom: "La cédula no es válida." });
        }
        return value;
      }),
    phone: Joi.string().trim().length(10).pattern(/^\d+$/).required().messages({
      "string.base": "El teléfono debe ser una cadena de caracteres.",
      "string.empty": "El teléfono no debe estar vacío.",
      "string.length": "El teléfono debe tener exactamente 10 dígitos.",
      "string.pattern.base": "El teléfono solo debe contener dígitos (0-9).",
      "any.required": "El teléfono es un campo obligatorio.",
    }),
    birth_date: Joi.string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .messages({
        "string.base": "La fecha debe ser una cadena de caracteres.",
        "string.empty": "La fecha no debe estar vacía.",
        "string.pattern.base": "La fecha debe tener el formato YYYY-MM-DD.",
        "any.required": "La fecha es un campo obligatorio.",
      }),
      charge_id: Joi.required(),
      area_id: Joi.required()
  }),
};

export const getRecoverValidation = {
  body: Joi.object({
    user_name: Joi.string().required(),
    code: Joi.string().required(),
  }),
};

export const postChangePassValidation = {
  body: Joi.object({
    password: Joi.string(),
    token: Joi.string().required(),
  }),
};
