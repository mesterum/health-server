// https://www.calculator.net/calorie-calculator.html

export type CalcBase = {
  age: number // age in years 15-80
  height: number // height in cm 150-220
  weight: number // weight in kg 30-300
  desiredWeight: number // weight in kg after a week. No less than weight - 1kg. 
  // bloodType: "O" | "A" | "B" | "AB"
  bloodType: number // 1-4
  /* gender: "male" | "female"
  activity: "sedentary" | "light" | "moderate" | "active" | "veryactive"  // 1.2 - 1.375 - 1.465 - 1.55 - 1.725
  goal: "lose" | "maintain" | "gain" */
  dailyKcalories: number
  // time: number

};

export type User = {
  email: string;
  password: string;
  token?: string;
  calcBase: CalcBase
}

export type Product = {
  categories: string
  title: string
  weight: number
  calories: number
  groupBloodNotAllowed: boolean[]
}

export type Intake = {
  product: Product
  weight: number
}

export type DailyIntake = {
  date: Date
  intake: Intake[]
  totalCalories: number
}