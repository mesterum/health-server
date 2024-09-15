import { DocumentType, getModelForClass, prop } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
export class CalcBase {

  @prop({ required: true, min: 15, max: 80 })
  age!: number // age in years 15-80
  @prop({ required: true, min: 150, max: 220 })
  height!: number // height in cm 150-220
  @prop({ required: true, min: 30, max: 300 })
  weight!: number // weight in kg 30-300
  @prop({
    validate(this: DocumentType<CalcBase>, v: number) {
      return Math.abs(v - this.weight) <= 1
    },
    default(this: DocumentType<CalcBase>) {
      return this.weight
    }
  })
  desiredWeight!: number // weight in kg after a week. No less than weight - 1kg.
  // bloodType: "O" | "A" | "B" | "AB"
  @prop({ required: true, enum: [1, 2, 3, 4] })
  bloodType!: number // 1-4
  /* gender: "male" | "female"
  activity: "sedentary" | "light" | "moderate" | "active" | "veryactive"  // 1.2 - 1.375 - 1.465 - 1.55 - 1.725
  goal: "lose" | "maintain" | "gain" */
  @prop({ default: CalcBase.prototype.getDailyKcalories })
  dailyKcalories?: number
  @prop({ type: Date, default: Date.now })
  modifiedAt?: Date

  public getDailyKcalories(this: DocumentType<CalcBase>) {
    // 1.2 - 1.375 - 1.465 - 1.55 - 1.725
    // BMR = 10W + 6.25H - 5A - 161
    const BMR = 10 * this.weight + 6.25 * this.height - 5 * this.age - 161
    return Math.round(BMR * 1.2) - (this.weight - this.desiredWeight) * 1000
  }


}

export default getModelForClass(CalcBase);

