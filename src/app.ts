import express, { Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'

import contactsRouter from './api/contacts.js'
// import authRouter from './api/auth/server.js'
import { createExpressEndpoints } from '@ts-rest/express';
import UserContract from './api/auth/contract.js';
import router from './api/auth/router.js';

import { generateOpenApi } from '@ts-rest/open-api';
import { serve, setup } from "swagger-ui-express";
import { operationMapper } from './operationMapper.js';
import { url } from 'inspector';

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)
// app.use('/api/users', authRouter)
createExpressEndpoints(UserContract, router, app)

const openApiDocument = generateOpenApi(UserContract, {
  info: {
    title: 'SlimMom API',
    version: '1.0.0',

  },
  servers: [{ url: 'http://localhost:3000' },
  { url: "https://xc8jbrf4-3000.euw.devtunnels.ms" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [{ bearerAuth: [] }]
}, {
  operationMapper
});

app.use('/api-docs', serve, setup(openApiDocument));
app.get("/swagger.json", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.send(JSON.stringify(openApiDocument, null, 2));
});

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: `Use api on routes: 
    /api/users/signup - registration user {email, password}
    /api/users/login - login {email, password}
    /api/users/logout - logout
    /api/users/current - get message if user is authenticated`,
    data: 'Not found',
  })
})

app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({ message: err.message })
})

export default app
