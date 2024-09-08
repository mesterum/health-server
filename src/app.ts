import express, { Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'

import contactsRouter from './api/contacts.js'
import authRouter from './api/auth.js'

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/api/users', authRouter)

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
