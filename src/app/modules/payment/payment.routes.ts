import { Router } from "express";
import { paymentController } from "./payment.controller";

export const paymentRoutes = Router()

paymentRoutes.post("/success", paymentController.successPayment)
// paymentRoutes.post("/fail", paymentController.failPayment)
// paymentRoutes.post("/cancel", paymentController.cancelPayment)
// paymentRoutes.post("/rePay/:bookingId", paymentController.rePayment)
// paymentRoutes.post("/validate-payment", paymentController.validatePayment) // this will hit by sslcommerze
// validate hobe oder end theke


/*

When booking starts, a transaction rollback will also start, because two collections are being updated one after another.

1. Create a new booking document.
2. Create a new payment document and update the booking document.
3. Create the sslPayload.
4. Call sslService.sslPaymentInit(sslPayload).
5. Inside sslPaymentInit(), the user is redirected to the SSLCommerz payment page:

If success: SSLCommerz will hit SSL_SUCCESS_BACKEND_URL, which reaches the backend and then redirects to the frontend SSL_SUCCESS_FRONTEND_URL.

If failed: SSLCommerz will hit SSL_FAIL_BACKEND_URL, then redirect to the frontend SSL_FAIL_FRONTEND_URL.

If cancelled: SSLCommerz will hit SSL_CANCEL_BACKEND_URL, then redirect to the frontend SSL_CANCEL_FRONTEND_URL.

+++++
ssl will call /validate-payment and call validatePayment in the ssl service
we will get paymentGatewayData in ssl service validatePatment

Note:
If the user wants to repay, take the bookingId from the URL params and start again from Step 3.

*/