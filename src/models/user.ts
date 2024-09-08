import { z } from 'zod';

export const userSchema = z.object({
  // @prop({ required: [true, 'Password is required'] })
  password: z.string({ required_error: 'Password is required' }),
  // @prop({ required: [true, 'Email is required'], unique: true })
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email' }),
  // @prop({ default: null })
  token: z.string().nullish(),
  // @prop({ enum: ["starter", "pro", "business"], default: "starter" })
  subscription: z.enum(["starter", "pro", "business"]).default("starter"),
});

export type User = z.infer<typeof userSchema>;