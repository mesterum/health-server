import express from 'express'
import validate from 'express-zod-safe';
import { userSchema } from './schema.js'
const router = express.Router()

import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserSchema, { User } from './dbmodel.js';
import { secret } from '../../config/passport.js';
import type { RequestHandler } from 'express'
import type { DocumentType } from '@typegoose/typegoose';

export const auth: RequestHandler = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err: any, user?: DocumentType<User>) => {
    if (!user || err) {
      return res.status(401).json({
        status: 'error',
        code: 401,
        message: 'Unauthorized',
        data: 'Unauthorized',
      })
    }
    req.authUser = user
    next()
  })(req, res, next)
}

router.post('/signup', validate({ body: userSchema }), async (req, res, next) => {
  const { name, email, password } = req.body
  const user = await UserSchema.findOne({ email })
  if (user) {
    return res.status(409).json({
      message: 'User already exists',
    })
  }
  try {
    const newUser = new UserSchema({ name, email })
    await newUser.setPassword(password)
    // console.log(newUser.password);
    await newUser.save()
    res.status(201).json({
      name, email
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', validate({ body: userSchema.pick({ email: true, password: true }) }), async (req, res, next) => {
  const { email, password } = req.body
  const user = await UserSchema.findOne({ email })

  if (!user || !user.isValidPassword(password)) {
    return res.status(400).json({
      message: 'Username or password incorrect',
    })
  }

  const payload = {
    id: user._id.toString("hex"),
    // username: user.email,
  }

  const token = jwt.sign(payload, secret, { expiresIn: '1h' })
  user.token = token
  user.save()
  res.json({
    token,
    "email": user.email,
    name: user.name
  })
})

router.get('/logout', auth, (req, res, next) => {
  const user = req.authUser
  user.token = null
  user.save()
  res.status(204).end()
})

router.get('/current', auth, (req, res, next) => {
  const { name, email } = req.authUser
  res.json({ name, email })
})

export default router
