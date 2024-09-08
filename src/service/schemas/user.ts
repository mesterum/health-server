import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
export class User {
  @prop({ required: [true, 'Password is required'] })
  password!: string;

  @prop({ required: [true, 'Email is required'], unique: true })
  email!: string;

  @prop({ default: null })
  token: string | null = null;

  @prop({ enum: ["starter", "pro", "business"], default: "starter" })
  subscription: "starter" | "pro" | "business" = "starter";

  public async setPassword(this: DocumentType<User>, password: string) {
    this.password = await bcrypt.hash(password, 10);
  }

  public async isValidPassword(this: DocumentType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }

}

export default getModelForClass(User);

