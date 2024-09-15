import { initServer } from "@ts-rest/express";
import { ProductsContract } from "../../contract/products.js";
import ProductSchema from './dbmodel.js';

const s = initServer();

export const productsRouter = s.router(ProductsContract, {
  findProducts: async ({ query: { search = '', page = 1 } }) => {
    const products = await ProductSchema.find({ $text: { $search: search } })
      .limit(10).skip((page - 1) * 10).select({
        groupBloodNotAllowed: 0, categories: 0
      })
    return {
      status: 200,
      body: products
    };
  }
})

export { ProductsContract }