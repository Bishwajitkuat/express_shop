const { ObjectId } = require("mongodb");
const { z } = require("zod");

const ProductAddInputSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Product title should at lest 2 charecters long!" }),
  price: z.coerce.number().min(1, { message: "Please enter a valid number!" }),
  description: z.string().min(10, {
    message: "Product description should at lest 100 charecters long!",
  }),
  imgUrl: z.string().url().min(1, {
    message: "Please enter a valid url!",
  }),
});

const ProductEditInputSchema = ProductAddInputSchema.extend({
  _id: z.instanceof(ObjectId),
});

module.exports = { ProductAddInputSchema, ProductEditInputSchema };
