import { z } from 'zod';

const emailSchema = z.string().trim().email('Enter a valid email address').transform((email) => email.toLowerCase());

export const registerUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters'),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password cannot exceed 72 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((user) => user.password === user.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
}).transform(({ confirmPassword, ...user }) => user);

export const loginUserSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(72, 'Password cannot exceed 72 characters'),
}).transform(({ confirmPassword, ...user }) => user);

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters').optional(),
  email: emailSchema.optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password cannot exceed 72 characters').optional(),
  confirmPassword: z.string().optional(),
}).superRefine((user, context) => {
  if (Object.keys(user).length === 0) {
    context.addIssue({ code: 'custom', message: 'At least one user field is required' });
  }

  if (user.password && user.password !== user.confirmPassword) {
    context.addIssue({
      code: 'custom',
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    });
  }

  if (!user.password && user.confirmPassword) {
    context.addIssue({
      code: 'custom',
      path: ['password'],
      message: 'Password is required when confirming a password',
    });
  }
});
