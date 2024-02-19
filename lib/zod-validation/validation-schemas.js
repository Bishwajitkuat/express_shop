const { z } = require("zod");

exports.LoginInputSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address!" }),
  password: z
    .string()
    .min(6, { message: "Password must be 6 or more characters long" }),
});

exports.SignupInputSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long!" }),
    email: z.string().email({ message: "Please enter a valid email address!" }),
    password: z
      .string()
      .min(6, { message: "Password must be 6 or more characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"],
  });

exports.resetPasswordInputSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address!" }),
});
