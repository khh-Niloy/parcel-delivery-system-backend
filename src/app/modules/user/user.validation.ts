import z from "zod";
import { AvailableStatus, ExperienceLevel, Role, VehicleType } from "./user.interface";

export const userRegisterZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: z
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    phone: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
    address: z
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." }),
    isDeleted: z
        .boolean({ invalid_type_error: "isDeleted must be true or false" })
        .optional(),
    isBlocked: z
        .boolean({ invalid_type_error: "isBlocked must be true or false" })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string]),

    
    // delivery agent

    vehicleType: z.enum(Object.values(VehicleType) as [string], {
        errorMap: () => ({ message: "Vehicle type must be one of: bike, car, van, other" }),
    }).optional(),
    licenseNumber: z
        .string({ invalid_type_error: "License number must be string" })
        .min(5, { message: "License number must be at least 5 characters." }).optional(),
    experienceLevel: z.enum(Object.values(ExperienceLevel) as [string], {
        errorMap: () => ({ message: "Experience level must be one of: beginner, intermediate, expert" }),
    }).optional(), 

    // delivery agent
}).superRefine((data, context)=>{
    if(data.role === Role.DELIVERY_AGENT){
        if(!data.vehicleType){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Vehicle type is required for delivery agent",
                path: ["vehicleType"],
            })
        }
        if(!data.licenseNumber){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "licenseNumber is required for delivery agent",
                path: ["licenseNumber"],
            })
        }
        if(!data.experienceLevel){
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "experienceLevel is required for delivery agent",
                path: ["experienceLevel"],
            })
        }
    }
})


export const userUpdateZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    phone: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
    address: z
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." }),
    isDeleted: z
        .boolean({ invalid_type_error: "isDeleted must be true or false" }),
    isBlocked: z
        .boolean({ invalid_type_error: "isBlocked must be true or false" }),
    role: z
        .enum(Object.values(Role) as [string])
}).partial()


export const passwordChangeZodSchema = z.object({
    password: z
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
})

export const udpateDeliveryAgentStatusZodSchema = z.object({
    availableStatus: z.enum(Object.values(AvailableStatus) as [string], {
        errorMap: () => ({ message: "available Status must be one of: available, busy, offline" }),
    }),
})
