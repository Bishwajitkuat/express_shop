const { z } = require("zod");

exports.LoginInputSchema = z.object({
  email: z
    .string()
    .min(1)
    .email({ message: "Please enter a valid email address!" }),
  password: z
    .string()
    .min(6, { message: "Password must be 6 or more characters long" }),
});
