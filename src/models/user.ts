import { z } from 'zod';

export const userSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  // @prop({ required: [true, 'Password is required'] })
  password: z.string({ required_error: 'Password is required' }),
  // @prop({ required: [true, 'Email is required'], unique: true })
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
  // @prop({ default: null })
  token: z.string().nullish(),
});

export type User = z.infer<typeof userSchema>;