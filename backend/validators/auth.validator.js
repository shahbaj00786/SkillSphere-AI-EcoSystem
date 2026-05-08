import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
  }),

  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email',
  }),

  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
  }),

  role: Joi.string().valid('client', 'freelancer').required().messages({
    'any.only': 'Role must be client or freelancer',
    'string.empty': 'Role is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email',
  }),

  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please enter a valid email',
  }),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required',
  }),

  password: Joi.string().min(8).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters',
  }),
});

export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};