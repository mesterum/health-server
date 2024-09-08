import express from 'express'
import validate from 'express-zod-safe';
import { userSchema } from '../models/user.js'
const router = express.Router()

import jwt from 'jsonwebtoken';
import passport from 'passport';
import UserSchema, { User } from '../service/schemas/user.js';
import { secret } from '../config/passport.js';
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
    req.user = user
    next()
  })(req, res, next)
}

router.post('/signup', validate({ body: userSchema }), async (req, res, next) => {
  const { email, password } = req.body
  const user = await UserSchema.findOne({ email })
  if (user) {
    return res.status(409).json({
      status: 'error',
      code: 409,
      message: 'Email is already in use',
      data: 'Conflict',
    })
  }
  try {
    const newUser = new UserSchema({ email })
    await newUser.setPassword(password)
    // console.log(newUser.password);
    await newUser.save()
    res.status(201).json({
      email,
      "subscription": newUser.subscription
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', validate({ body: userSchema }), async (req, res, next) => {
  const { email, password } = req.body
  const user = await UserSchema.findOne({ email })

  if (!user || !user.isValidPassword(password)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Incorrect login or password',
      data: 'Bad request',
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
    "user": {
      "email": user.email,
      "subscription": user.subscription
    }
  })
})

router.get('/logout', auth, (req, res, next) => {
  const user = req.user as DocumentType<User>
  user.token = null
  UserSchema.findByIdAndUpdate(user._id, { token: null })
  res.status(204).end()
})

router.get('/current', auth, (req, res, next) => {
  const { email, subscription } = req.user as User
  res.json({ email, subscription })
})

export default router
