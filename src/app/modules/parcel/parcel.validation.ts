import { z } from "zod";

export const createParcelZodSchema = z.object({
  type: z.string({
    required_error: "Parcel type is required",
  }),

  weight: z
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .positive("Weight must be a positive number"),

  receiverPhoneNumber: z
    .string({
      required_error: "Receiver PhoneNumber is required",
    }),

  deliveryAddress: z.string({
    required_error: "Delivery address is required",
  }),

  pickupAddress: z.string({
    required_error: "Pickup address is required",
  }),

  deliveryDate: z
    .string({
      required_error: "Delivery date is required",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid delivery date format",
    }),
});

export const updateParcelZodSchema = z.object({
  type: z.string({
    required_error: "Parcel type is required",
  }),

  weight: z
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .positive("Weight must be a positive number"),

  deliveryAddress: z.string({
    required_error: "Delivery address is required",
  }),

  pickupAddress: z.string({
    required_error: "Pickup address is required",
  }),

  deliveryDate: z
    .string({
      required_error: "Delivery date is required",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid delivery date format",
    }),
}).partial();
