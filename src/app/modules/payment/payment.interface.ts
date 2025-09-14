/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export interface IPayment {
    parcelId: Types.ObjectId;
    transactionId: string;
    amount: number;
    paymentGatewayData?: any
    invoiceUrl?: string
    status: PAYMENT_STATUS
    trackingId?: string
    url?: string
}