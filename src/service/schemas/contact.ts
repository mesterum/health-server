import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { User } from "./user.js";

export class Contact {
  @prop({ ref: () => User })
  owner?: Ref<User>;

  @prop({ required: [true, 'Set name for contact'] })
  name!: string;

  @prop()
  email?: string;

  @prop()
  phone?: string;

  @prop({ default: false })
  favorite?: boolean = false;
}

export default getModelForClass(Contact);
