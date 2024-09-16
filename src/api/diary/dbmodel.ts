import { DocumentType, getModelForClass, index, isDocument, pre, prop, Ref } from "@typegoose/typegoose";
import ProductModel, { Product } from "../products/dbmodel.js";
import { User } from "../auth/dbmodel.js";
import { Types } from "mongoose";

@pre<Intake>('validate', async function (this: DocumentType<Intake>) {
  if (typeof this.calories == "undefined")
    this.calories = await this.getCalories()
})
export class Intake {
  @prop({ ref: () => Product, required: true })
  product!: Ref<Product>
  @prop({ required: true })
  weight!: number
  @prop({})
  calories?: number
  async getCalories(this: DocumentType<Intake>) {
    // await this.populate('product')
    let product = this.product
    if (!isDocument(product)) {
      let prod = await ProductModel.findById(product)
      if (!prod) return;
      product = prod
    }
    return Math.round(product.calories * (this.weight / product.weight))
  }
}

export const IntakeModel = getModelForClass(Intake);

@index({ user: 1, date: 1 }, { unique: true })
export class Diary {
  @prop({ required: true, ref: () => User })
  user!: Ref<User>
  @prop({ required: true })
  date!: Date
  @prop({ type: () => Intake })
  items!: Types.DocumentArray<Intake>
  @prop({ default: 0 })
  totalCalories!: number
}

export const DiaryModel = getModelForClass(Diary)
