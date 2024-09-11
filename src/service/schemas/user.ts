import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
export class User {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ default: null, type: String })
  token?: string | null;

  public async setPassword(this: DocumentType<User>, password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  public async isValidPassword(this: DocumentType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }

}

export default getModelForClass(User);

