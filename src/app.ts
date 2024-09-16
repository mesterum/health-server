import express, { Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'

import contactsRouter from './api/contacts.js'
// import authRouter from './api/auth/server.js'
import { createExpressEndpoints } from '@ts-rest/express';
import UserContract from './contract/users.js';
import authRouter from './api/auth/router.js';

import { generateOpenApi } from '@ts-rest/open-api';
import { serve, setup } from "swagger-ui-express";
import { operationMapper } from './operationMapper.js';
import { CalcContract } from './contract/calc.js';
import { calcRouter } from './api/calc/router.js';
import { contract } from './contract/index.js';
import { ProductsContract, productsRouter } from './api/products/router.js';
import { DiaryContract, diaryRouter } from './api/diary/router.js';

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())


createExpressEndpoints(UserContract, authRouter, app)
createExpressEndpoints(CalcContract, calcRouter, app)
createExpressEndpoints(ProductsContract, productsRouter, app)
createExpressEndpoints(DiaryContract, diaryRouter, app)

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: 'SlimMom API',
    version: '1.0.0',

  },
  servers: [{ url: process.env.BASE_URL }],
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

app.use('/doc', serve, setup(openApiDocument));
app.get("/swagger.json", (req: Request, res: Response) => {
  res.contentType("application/json");
  res.send(JSON.stringify(openApiDocument, null, 2));
});

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: `See the documentation for available routes on ${process.env.BASE_URL}/doc 
    or download OpenAPI spec at ${process.env.BASE_URL}/swagger.json`,
    data: 'Not found',
  })
})

app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({ message: err.message })
})

export default app
