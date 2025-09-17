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

  deliveryAddress: z.object({
   
    latitude: z.number({
      required_error: "Delivery address latitude is required",
    }),
    longitude: z.number({
      required_error: "Delivery address longitude is required",
    }),
  }),

  pickupAddress: z.object({
    
    latitude: z.number({
      required_error: "Pickup address latitude is required",
    }),
    longitude: z.number({
      required_error: "Pickup address longitude is required",
    }),
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

    deliveryAddress: z.object({
      
      latitude: z.number({
        required_error: "Delivery address latitude is required",
      }),
      longitude: z.number({
        required_error: "Delivery address longitude is required",
      }),
    }),
  
    pickupAddress: z.object({
      
      latitude: z.number({
        required_error: "Pickup address latitude is required",
      }),
      longitude: z.number({
        required_error: "Pickup address longitude is required",
      }),
    }),

  deliveryDate: z
    .string({
      required_error: "Delivery date is required",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid delivery date format",
    }),
}).partial();
