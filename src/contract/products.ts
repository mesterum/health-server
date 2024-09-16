import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import type { SecurityRequirementObject } from "openapi3-ts";

export const productsSchema = z.object({
  categories: z.string(),
  title: z.string(),
  weight: z.number(),
  calories: z.number(),
  groupBloodNotAllowed: z.boolean().nullable().array().length(5)

});

export type Products = z.output<typeof productsSchema>;


const contract = initContract();

export const ProductsContract = contract.router({
  findProducts: {
    method: 'GET',
    path: '/',
    query: z.object({ search: z.string().optional(), page: z.coerce.number().default(1) }),
    responses: {
      200: z.array(productsSchema.omit({ groupBloodNotAllowed: true, categories: true })).describe('The found products'),
    },
    summary: 'Finds products',
    description: 'Finds 10 products that have in title the search string',
    metadata: { openApiSecurity: [{}] as SecurityRequirementObject[] }
  },
}, {
  pathPrefix: '/api/products',
});