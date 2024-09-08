import passport from 'passport'
import passportJWT from 'passport-jwt'
import UserSchema, { User } from '../service/schemas/user.js'
import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000
export const uriDb = process.env.DB_HOST!
if (!uriDb) throw new Error("Please set the environment variable: DB_HOST");
export const secret = process.env.SECRET!
if (!secret) throw new Error("Please set the environment variable: SECRET");



const ExtractJWT = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const params: passportJWT.StrategyOptionsWithoutRequest = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}

// JWT Strategy
passport.use(
  new Strategy(params, function (payload: {
    id: string;
  }, done) {
    UserSchema.findById(payload.id)
      .then((user) => !user ? done(new Error('User not found')) :
        user.token ? done(null, user) : done(new Error('User logged out')))
      .catch(done)
  })
)
