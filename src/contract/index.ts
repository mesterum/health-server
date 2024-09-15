import { initContract } from "@ts-rest/core";
import { CalcContract } from "./calc.js";
import UserContract from "./users.js";

const c = initContract();

export const contract = c.router({
  users: UserContract,
  calc: CalcContract,
});