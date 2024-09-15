import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import { CalcBase } from "../calc/dbmodel.js";
export class User {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ default: null, type: String })
  token?: string | null;

  @prop({ default: null, type: () => CalcBase })
  calcBase?: CalcBase;

  public async setPassword(this: DocumentType<User>, password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  public async isValidPassword(this: DocumentType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }

}

export default getModelForClass(User);

