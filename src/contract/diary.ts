import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import type { SecurityRequirementObject } from "openapi3-ts";
const openApiSecurity: SecurityRequirementObject[] = [{ bearerAuth: [] }]
export const mongoId = z.string().regex(/^[0-9a-f]{24}$/);
export const itemSchema = z.object({
  product: mongoId,
  weight: z.number(),
  calories: z.number().optional(),
});
export const diarySchema = z.object({
  date: z.date(),//YYYY-MM-DD
  items: z.array(itemSchema),
  totalCalories: z.number(),
});
export const summary = z.object({
  totalCalories: z.number(), length: z.number().int()
})

export type Diary = z.output<typeof diarySchema>;


const contract = initContract();

const res401 = z.object({ message: z.literal("Unauthorized") }).describe('Unauthorized')

export const DiaryContract = contract.router({
  listItems: {
    method: 'GET',
    path: '/:date',
    pathParams: z.object({ date: z.coerce.date() }),
    responses: {
      200: diarySchema
    },
    summary: 'List items from the diary',
    // description: '',
    metadata: { openApiSecurity }
  },
  addItem: {
    method: 'POST',
    path: '/:date',
    pathParams: z.object({ date: z.coerce.date() }),
    responses: {
      200: summary.extend({ newItems: z.array(mongoId) }),
    },
    body: itemSchema.or(itemSchema.array()),
    summary: 'Add items to the diary',
    // description: '',
    metadata: { openApiSecurity }
  },
  deleteItem: {
    method: 'DELETE',
    path: '/:date',
    pathParams: z.object({ date: z.coerce.date() }),
    body: mongoId.array().describe('The ids of the items to delete'),
    responses: {
      200: summary,
      404: z.object({ message: z.literal("Not found") }).describe('Not found'),
    },
    summary: 'Delete some items from the diary',
    // description: '',
    metadata: { openApiSecurity }
  }
}, {
  strictStatusCodes: true,
  commonResponses: {
    401: res401,
    500: z.unknown().describe('Internal server error'),
  },
  pathPrefix: '/api/diary',
});