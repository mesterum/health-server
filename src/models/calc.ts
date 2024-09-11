import { z } from 'zod';

export const calcBaseSchema = z.object({
  /* 
  age: number // age in years 15-80
  height: number // height in cm 150-220
  weight: number // weight in kg 30-300
  desiredWeight: number // weight in kg after a week. No less than weight - 1kg. 
  // bloodType: "O" | "A" | "B" | "AB"
  bloodType: number // 1-4
  dailyKCalories: number */

  age: z.number().min(15).max(80),
  height: z.number().min(150).max(220),
  weight: z.number().min(30).max(300),
  desiredWeight: z.number().min(30).max(300).optional(),
  bloodType: z.number().min(1).max(4),
  dailyKCalories: z.number().default(2000),
  createdAt: z.date().default(() => new Date()),
});

export type CalcBase = z.infer<typeof calcBaseSchema>;