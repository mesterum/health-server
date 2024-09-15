import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import type { SecurityRequirementObject } from "openapi3-ts";

export const calcBaseSchema = z.object({
  // @prop({ required: true, min: 15, max: 80 })
  age: z.number().min(15).max(80).describe('age in years: 15-80'), // age in years 15-80
  // @prop({ required: true, min: 150, max: 220 })
  height: z.number().min(150).max(220).describe('height in cm: 150-220'), // height in cm 150-220
  // @prop({ required: true, min: 30, max: 300 })
  weight: z.number().min(30).max(300).describe('weight in kg: 30-300'), // weight in kg 30-300
  /* @prop({
    validate(this: DocumentType<CalcBase>, v: number) {
      return Math.abs(v - this.weight) <= 1
    },
    default(this: DocumentType<CalcBase>) {
      return this.weight
    }
  }) */
  desiredWeight: z.number().optional().describe('weight in kg after a week. No less than the weight - 1kg.'), // weight in kg after a week. No less than weight - 1kg.
  // bloodType: "O" | "A" | "B" | "AB"
  // @prop({ required: true, enum: [1, 2, 3, 4] })
  bloodType: z.number().int().min(1).max(4).describe('1-4 for O, A, B, AB'), // 1-4
  /* @prop({ type: Date, default: Date.now })
  modifiedAt ?: Date */

}).transform((data, ctx) => {
  if (data.desiredWeight === undefined) {
    data.desiredWeight = data.weight
    return data;
  }
  if (Math.abs(data.desiredWeight - data.weight) > 1)
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'desiredWeight must be in weight -/+ 1kg range.',
      path: ['desiredWeight']
    })
  return data;
});

const calcBaseSchema2 = calcBaseSchema.sourceType().extend({
  // @prop({ default: CalcBase.prototype.getDailyKcalories })
  dailyKcalories: z.number().optional().describe('the computed daily Kcalories'),
})
export type CalcBase = z.output<typeof calcBaseSchema>;
// export const calcBaseSchema: z.ZodType<CalcBase, z.ZodTypeDef, CalcBase> = calcBaseSchema2


const contract = initContract();

const res401 = z.object({ message: z.literal("Unauthorized") }).describe('Unauthorized')

export const CalcContract = contract.router({
  calcCalories: {
    method: 'POST',
    path: '/calc',
    responses: {
      200: calcBaseSchema2.pick({ dailyKcalories: true }).extend({
        productsNotAllowed: z.array(z.string()),
      }),
    },
    body: calcBaseSchema,
    summary: 'Daily calories estimation',
    description: 'Estimate the number of calories a female with a sedentary lifestyle needs to consume each day',
    metadata: { openApiSecurity: [{}, { bearerAuth: [] }] as SecurityRequirementObject[] }
  },
  getCalories: {
    method: 'GET',
    path: '/calc',
    responses: {
      200: z.object({
        calcBase: calcBaseSchema.optional(),
        productsNotAllowed: z.array(z.string()),
      }),
      401: res401
    },
    summary: 'Daily calories estimation',
    description: 'Estimate the number of calories a female with a sedentary lifestyle needs to consume each day',
    metadata: { openApiSecurity: [{ bearerAuth: [] }] as SecurityRequirementObject[] }
  },
}, {
  pathPrefix: '/api',
});