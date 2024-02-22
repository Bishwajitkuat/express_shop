const { default: mongoose } = require("mongoose");
const { z } = require("zod");

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ImageValidationSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    destination: z.string(),
    filename: z.string().min(1, { message: "image is required!" }),
    path: z.string(),
    size: z.number(),
  })
  .refine((data) => data.size <= 5000000, {
    message: `Max image size is 5MB.`,
    path: ["size"],
  })
  .refine((data) => ACCEPTED_IMAGE_TYPES.includes(data.mimetype), {
    message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
    path: ["mimetype"],
  });

const ProductAddInputSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Product title should at lest 2 charecters long!" }),
  price: z.coerce.number().min(1, { message: "Please enter a valid number!" }),
  description: z.string().min(10, {
    message: "Product description should at lest 10 charecters long!",
  }),
});

const ProductEditInputSchema = ProductAddInputSchema.extend({
  _id: z.custom(
    (value) => {
      const valueAsString = String(value);
      if (mongoose.Types.ObjectId.isValid(valueAsString)) return true;
      return false;
    },
    { message: "Wrong type of product Id!" }
  ),
});

const IsStringCanBeObjectIdSchema = z.custom(
  (value) => {
    const valueAsString = String(value);
    if (mongoose.Types.ObjectId.isValid(valueAsString)) return true;
    return false;
  },
  { message: "Wrong type of product Id!" }
);

const PostAddToCartInputSchema = z.object({
  productId: z.custom(
    (value) => {
      const valueAsString = String(value);
      if (mongoose.Types.ObjectId.isValid(valueAsString)) return true;
      return false;
    },
    { message: "Wrong type of product Id!" }
  ),
  fromCart: z.string(),
});

const PostRemoveFromCartInputSchema = z.object({
  productId: z.custom(
    (value) => {
      const valueAsString = String(value);
      if (mongoose.Types.ObjectId.isValid(valueAsString)) return true;
      return false;
    },
    { message: "Wrong type of product Id!" }
  ),
  quantity: z.coerce.number(),
});

module.exports = {
  ProductAddInputSchema,
  ProductEditInputSchema,
  IsStringCanBeObjectIdSchema,
  PostAddToCartInputSchema,
  PostRemoveFromCartInputSchema,
  ImageValidationSchema,
};
