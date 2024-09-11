import type { RequestHandler } from 'express'
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { secret } from '../../config/passport.js';
import { initServer } from "@ts-rest/express";
import UserContract from "./contract.js";
import UserSchema, { User } from './dbmodel.js';
import type { DocumentType } from '@typegoose/typegoose';

export const auth: RequestHandler = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err: any, user?: DocumentType<User>) => {
    if (!user || err) {
      return res.status(401).json({
        message: 'Unauthorized'
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

const s = initServer();

const UserRouter = s.router(UserContract, {
  register: async ({ body: { name, email, password } }) => {
    const user = await UserSchema.findOne({ email });
    if (user)
      return { status: 409, body: { message: "User already exists" } };
    try {
      const newUser = new UserSchema({ name, email });
      await newUser.setPassword(password);
      // console.log(newUser.password);
      await newUser.save();
      return { status: 201, body: { name, email } };
    } catch (error) {
      return { status: 500, body: error };
    }
  },
  login: async ({ body: { email, password } }) => {
    const user = await UserSchema.findOne({ email })

    if (!user || !user.isValidPassword(password)) {
      return { status: 400, body: { message: 'Username or password incorrect' } };
    }

    const payload = {
      id: user._id.toString("hex"),
      // username: user.email,
    }

    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    user.token = token
    user.save()
    return { status: 200, body: { token, name: user.name, email: user.email } };
  },
  logout: {
    handler: async ({ req }) => {
      const user = req.user as DocumentType<User>
      user.token = null
      user.save()
      return { status: 204, body: undefined };
    },
    middleware: [auth]
  },
  current: {
    handler: async ({ req }) => {
      const { name, email } = req.user as DocumentType<User>
      return { status: 200, body: { name, email } };
    },
    middleware: [auth]
  }
});

export default UserRouter