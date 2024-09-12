import { DocumentType } from "@typegoose/typegoose";
import { User as AuthUser } from '../api/auth/dbmodel.js';

declare global {
  namespace Express {
    export interface Request {
      authUser: DocumentType<AuthUser>;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      SECRET: string;
      BASE_URL: string;
      PORT?: number;
      // Add more environment variables as needed
    }
  }

}

export { };