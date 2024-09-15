import type { RequestHandler } from 'express'
import passport from 'passport';
import { initServer } from "@ts-rest/express";
import { CalcContract } from "../../contract/calc.js";
import UserSchema, { User } from '../auth/dbmodel.js';
import type { DocumentType } from '@typegoose/typegoose';
import CalcBaseSchema, { CalcBase } from './dbmodel.js';
import { auth } from '../auth/router.js';
import groupBloodNotAllowed from '../../../db/groupBloodNotAllowed.json' assert { type: "json" };

const optAuth: RequestHandler = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err: any, user?: DocumentType<User>) => {
    if (user && !err)
      req.authUser = user
    next()
  })(req, res, next)
}

const s = initServer();

export const calcRouter = s.router(CalcContract, {
  calcCalories: {
    middleware: [optAuth],
    handler: async ({ body, req }) => {
      const calcBase = new CalcBaseSchema(body);
      if (req.authUser) {
        req.authUser.calcBase = calcBase;
        req.authUser.save();
      }
      return {
        status: 200,
        body: {
          dailyKcalories: calcBase.dailyKcalories,
          productsNotAllowed: groupBloodNotAllowed[calcBase.bloodType]
        }
      };
    }
  },
  getCalories: {
    middleware: [auth],
    handler: async ({ req }) => ({
      status: 200,
      body: {
        calcBase: req.authUser.calcBase,
        productsNotAllowed: groupBloodNotAllowed[req.authUser.calcBase?.bloodType ?? 0]
      }
    })
  }
})