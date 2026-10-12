import { errorResponse } from '../utils/response.js';
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from '../validation/user.schema.js';

const formatValidationErrors = (issues) => issues.reduce((errors, issue) => {
  const field = issue.path.length > 0 ? issue.path.join('.') : 'body';
  errors[field] ??= [];
  errors[field].push(issue.message);
  return errors;
}, {});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json(
      errorResponse('Validation failed', formatValidationErrors(result.error.issues)),
    );
  }

  req.body = result.data;
  next();
};

export const validateUserRegistration = validate(registerUserSchema);
export const validateUserLogin = validate(loginUserSchema);
export const validateUserUpdate = validate(updateUserSchema);
