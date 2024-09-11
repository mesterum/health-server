import { userSchema } from './schema.js';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import type { SecurityRequirementObject } from "openapi3-ts";

const contract = initContract();

const res401 = z.object({ message: z.literal("Unauthorized") }).describe('Unauthorized')

const UserContract = contract.router({
  register: {
    method: 'POST',
    path: '/signup',
    responses: {
      409: z.object({ message: z.literal("User already exists") }).describe('User already exists'),
      201: userSchema
        .pick({ name: true, email: true })
    },
    body: userSchema.pick({ name: true, email: true, password: true }),
    summary: 'Register a user',
    metadata: { openApiSecurity: [{} as SecurityRequirementObject] }
  },
  login: {
    method: 'POST',
    path: '/login',
    responses: {
      200: userSchema
        .omit({ password: true }),
      400: z.object({ message: z.literal("Username or password incorrect") })
        .describe('Username or password incorrect'),
    },
    body: userSchema.pick({ email: true, password: true }),
    summary: 'login a user',
    metadata: { openApiSecurity: [{} as SecurityRequirementObject] }
  },
  logout: {
    method: 'GET',
    path: '/logout',
    responses: {
      // 204: contract.noBody(),
      204: z.undefined().describe('Logout successful'),
      401: res401,
    },
    summary: 'Logout the current user'
  },
  current: {
    method: 'GET',
    path: '/current',
    responses: {
      200: userSchema.omit({ password: true, token: true }),
      401: res401,
    },
    summary: 'Get current user'
  }
}, {
  strictStatusCodes: true,
  commonResponses: {
    500: z.unknown().describe('Internal server error'),
  },
  pathPrefix: '/api/users',
});

export default UserContract;