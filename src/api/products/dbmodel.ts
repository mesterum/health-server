import { getModelForClass, prop } from "@typegoose/typegoose";
import { boolean } from "zod";

export class Product {
  @prop({ required: true })
  categories!: string
  @prop({ required: true, text: true })
  title!: string
  @prop({ required: true })
  weight!: number
  @prop({ required: true })
  calories!: number
  @prop({ required: true })
  groupBloodNotAllowed!: (boolean | null)[]
}

export default getModelForClass(Product);

