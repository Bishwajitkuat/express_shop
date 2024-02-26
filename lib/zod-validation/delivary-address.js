const { z } = require("zod");

const AddressInputSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name!" }),
  street_address: z
    .string()
    .min(5, { message: "Please enter full street address!" }),
  city: z.string().min(2, { message: "Please enter a city name!" }),
  postal_code: z.string().min(2, { message: "Please enter postal code!" }),
  country: z.string().min(1, { message: "Please enter the country name!" }),
  note: z.string().nullable(),
});

module.exports = { AddressInputSchema };
