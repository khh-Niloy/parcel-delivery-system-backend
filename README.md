# Parcel Delivery System Backend API

## Project Overview

The **Parcel Delivery API** is a secure, modular, and role-based backend system built with **Express.js** and **MongoDB** using **Mongoose**. Inspired by real-world delivery systems like **Pathao Courier** and **Sundarban**, this project manages parcel operations from creation to delivery tracking.

It supports four user roles—**Sender**, **Receiver**, **Delivery Agent**, and **Admin**—with tailored capabilities such as creating parcels, confirming delivery, managing delivery assignments, and overseeing system-wide operations.

✨ A key feature is the **automated assignment of parcels to available delivery agents**, streamlining dispatch and ensuring efficient delivery management. The platform ensures **status tracking**, **authentication**, **authorization**, and **real-time status logs**, making it suitable for production-ready logistics services.

### Live API Link

[Parcel Delivery System Backend API (Live)](https://parcel-delivery-system-backend-one.vercel.app)

- POST /api/v1/user/register  
- GET /api/v1/user  
- PATCH /api/v1/user/:id  

- POST /api/v1/auth/login  
- POST /api/v1/auth/logout  
- POST /api/v1/auth/change-password  
- POST /api/v1/auth/refresh-token  

- GET /api/v1/parcel/all-parcel  
- POST /api/v1/parcel/create-parcel  
- PATCH /api/v1/parcel/:trackingId  
- PATCH /api/v1/parcel/status/:trackingId  
- PATCH /api/v1/parcel/assign-delivery-agent/:trackingId  

- GET /api/v1/delivery-agent  
- POST /api/v1/delivery-agent/register  

- GET /


---

## Features

- **🔐 Secure Authentication & Authorization**
  - JWT-based login system
  - Passwords hashed using bcrypt
  - Role-based route protection via request headers

- **📦 Parcel Lifecycle Management**
  - Parcel creation, cancellation, editing parcel info
  - Automated parcel assignment to delivery agents
  - Delivery confirmation by receiver
  - Embedded status logs for every status update (location, status, time, updated by whom, note)
  - Unique tracking ID generation (`TRK-YYYYMMDD-XXXXXX` format)

- **👥 Role-Based Functionalities**
  - **Senders**: Create requests, edit parcel info, cancel parcels, and view all their parcels with status logs
  - **Receivers**: Track and confirm delivery, view incoming parcels, delivery history
  - **Delivery Agents**: View assigned parcels, update parcel status during transit
  - **Admins**: View, update, block/unblock users and parcels; manage all users and parcels

- **📊 Tracking & Status Logging**
  - Subdocument-based status logs with full history (location, status, time, updated by whom, note)
  - Status transition handling: Requested → Approved → Waiting → Dispatched → In Transit → Delivered → Confirmed, as well as Blocked and Cancelled statuses

- **🧱 Modular Code Architecture**
  - Clean and maintainable folder structure
  - Middleware-driven validation and error handling (global error handling, Zod errors, Mongoose errors, etc.)

- **📂 Project Structure**

<details>
  <summary>Project Folder Structure</summary>

```plaintext
- dist/
- node_modules/
- src/
  - app.ts
  - server.ts
  - app/
    - config/
      - env.config.ts
    - errorHelper/
      - AppError.ts
      - handleCastError.ts
      - handleDuplicateError.ts
      - handlerValidationError.ts
      - handlerZodError.ts
    - interface/
      - error.types.ts
      - index.d.ts
    - middleware/
      - globalErrorHandler.ts
      - notFound.ts
      - roleBasedAccess.ts
      - validateZodSchema.ts
    - modules/
      - auth/
        - auth.controller.ts
        - auth.routes.ts
        - auth.service.ts
      - parcel/
        - parcel.controller.ts
        - parcel.interface.ts
        - parcel.model.ts
        - parcel.routes.ts
        - parcel.service.ts
        - parcel.validation.ts
      - user/
        - user.controller.ts
        - user.interface.ts
        - user.model.ts
        - user.routes.ts
        - user.service.ts
        - user.validation.ts
    - route.ts
    - utility/
      - calculateFee.ts
      - cookiesManagement.ts
      - createTrackingId.ts
      - hashedPassword.ts
      - jwtTokens.ts
      - seedSuperAdmin.ts
      - statusFlow.ts
      - successResponse.ts
- eslint.config.mjs
- package-lock.json
- package.json
- tsconfig.json
- vercel.json
```
</details>


---

## 🧰 Tech Stack

| Category           | Technology                      |
|--------------------|--------------------------------|
| **Runtime**        | Node.js                        |
| **Framework**      | Express.js                     |
| **Database**       | MongoDB (with Mongoose ODM)    |
| **Authentication** | JSON Web Token (JWT), bcrypt   |
| **Validation**     | Zod, Custom Middleware         |
| **Testing**        | Postman                       |
| **Deployment**     | Vercel                        |
| **Others**         | TypeScript, ESLint, dotenv    |

---

### Dependencies (from `package.json`)

- bcryptjs
- cookie-parser
- cors
- dotenv
- express
- jsonwebtoken
- mongoose
- ts-node-dev
- zod

### Dev Dependencies

- @eslint/js
- @types/cookie-parser
- @types/express
- @types/jsonwebtoken
- eslint
- typescript
- typescript-eslint

---

## 🔐 Authentication & User Management API

### 📝 Registration

**Endpoint:**  
`POST https://parcel-delivery-system-backend-one.vercel.app/api/v1/user/register`

Registers a new user with one of the roles:

- `RECEIVER`
- `SENDER`
- `DELIVERY_AGENT`

**Required Fields:**
- For all roles: `name`, `email`, `password`, `address`, `phone`, `role`
- For `DELIVERY_AGENT` role: Additional fields `experienceLevel`, `licenseNumber`, `vehicleType`

---

### 🔑 Login

**Endpoint:**  
`POST https://parcel-delivery-system-backend-one.vercel.app/api/v1/auth/login`

**Details:**
- Provide correct `email` and `password`
- Returns access token and refresh token set in cookies

---

### 🚪 Logout

**Endpoint:**  
`POST https://parcel-delivery-system-backend-one.vercel.app/api/v1/auth/logout`

**Details:**
- Removes access token and refresh token from cookies

---

### ♻️ Refresh Token

**Endpoint:**  
`POST https://parcel-delivery-system-backend-one.vercel.app/api/v1/auth/refresh-token`

**Details:**
- Uses refresh token from cookies to verify and generate a new access token
- New access token is also set in cookies

---

### 🔒 Change Password

**Endpoint:**  
`PATCH https://parcel-delivery-system-backend-one.vercel.app/api/v1/auth/change-password`

**Details:**
- User must provide `oldPassword`
- If valid, new hashed password is saved in DB

---

## 👤 User-Related Endpoints

### ✏️ Update User Info

**Endpoint:**  
`PATCH https://parcel-delivery-system-backend-one.vercel.app/api/v1/user/:id`

**Headers:**  
`Authorization: <access_token>`

**Params:**  
User ID (e.g. `6888f316a12427de326d7542`)

**Body:**
```json
{
  "name": "MD. Farhan Ahmed"
}
```

---

### 👥 All Users (SENDER + RECEIVER)

**Endpoint:**  
`GET https://parcel-delivery-system-backend-one.vercel.app/api/v1/user/all-user`

**Headers:**  
`Authorization: Bearer <SUPER_ADMIN access_token>`

---

### 👨‍✈️ All Delivery Agents

**Endpoint:**  
`GET https://parcel-delivery-system-backend-one.vercel.app/api/v1/user/all-delivery-agent`

**Headers:**  
`Authorization: <access_token>`

---

### 🚦 Update Delivery Agent Availability Status

**Endpoint:**  
`PATCH https://parcel-delivery-system-backend-one.vercel.app/api/v1/user/update-availabe-status/:id`

**Headers:**  
`Authorization: <access_token>`

**Params:**  
Delivery Agent ID (e.g. `688dd6eec3980ae283f811e4`)

**Body:**
```json
{
  "availableStatus": "OFFLINE"
}
```

## 📦 Parcel API Endpoints

### 🚀 Create Parcel

**POST**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/create-parcel`

**Headers:**  
`Authorization: <access_token>`

**Body:**
```json
{
  "type": "Document",
  "weight": 2.5,
  "receiverPhoneNumber": "01733445566",
  "deliveryAddress": "Flat 4A, House 22, Road 10, Banani, Dhaka",
  "pickupAddress": "Gadget World, Level 5, Bashundhara City Shopping Mall, Dhaka",
  "deliveryDate": "2025-08-18T00:00:00.000Z"
}
```

---

### ✏️ Update Parcel Info (Before Dispatch)

**PATCH**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Params:**  
`trackingId` (e.g. `TRK-20250802-56623`)

**Body:**
```json
{
  "deliveryAddress": "House 7, Road 3, Gulshan 1, Dhaka"
}
```

---

### ✅ Admin Approves Parcel

**PATCH**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/status/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Body:**
```json
{
  "status": "APPROVED",
  "location": "Admin Panel",
  "note": "Parcel request has been approved by admin for processing.",
  "timestamp": "2025-07-31T19:25:00.000Z",
  "updatedBy": "ADMIN"
}
```

---

### ❌ Cancel Parcel (Before Dispatch)

**PATCH**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/status/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Body:**
```json
{
  "status": "CANCELLED",
  "location": "Sender Panel",
  "note": "Parcel request has been cancelled by the sender before dispatch.",
  "timestamp": "2025-08-02T18:30:00.000Z",
  "updatedBy": "SENDER"
}
```

---

### 👨‍✈️ Assign Delivery Agent (System Process)

**PATCH**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/assign-delivery-agent/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Params:**  
`trackingId`

---

### 🚚 Delivery Agent Marks Parcel as In Transit

**PATCH**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/status/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Body:**
```json
{
  "status": "IN_TRANSIT",
  "location": "Mohakhali Bus Stand, Dhaka",
  "note": "Parcel picked up and is now in transit by delivery agent",
  "updatedBy": "DELIVERY_AGENT"
}
```

---

### 📬 Delivery Agent Marks Parcel as Delivered

**PATCH**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/status/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Body:**
```json
{
  "status": "DELIVERED",
  "location": "House 7, Road 3, Gulshan 1, Dhaka",
  "note": "Parcel successfully delivered to the receiver",
  "updatedBy": "DELIVERY_AGENT"
}
```

---

### ✅ Receiver Confirms Delivery

**PATCH**  
`https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/status/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Body:**
```json
{
  "status": "CONFIRMED",
  "location": "House 7, Road 3, Gulshan 1, Dhaka",
  "note": "Receiver has confirmed the parcel delivery",
  "updatedBy": "RECEIVER"
}
```
# Parcel Delivery System - Parcel Assignment & Status Management

---

## Assign Delivery Agent to Parcel

If no delivery agent is available at the time of assignment, the parcel status will be set to `WAITING`.

**Endpoint:**  
`POST https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/assign-delivery-agent/:trackingId`

**Headers:**  
`Authorization: <access_token>`

**Params:**  
- `trackingId` - Parcel tracking ID

**Response Example:**  
```json
{
  "success": true,
  "message": "Could not find any available delivery agent, if someone available will be assigned",
  "data": null
}
```
# Parcel Delivery and Agent Status Logic (Pseudocode)

## When a Parcel is Delivered

IF `parcel.status` becomes `DELIVERED`:

- Find the delivery agent assigned to this parcel
- Mark the delivery agent as `AVAILABLE`
- Set their `currentParcelId` to `null`
- Increment their `completedDeliveries` count

AFTER 1 MINUTE DELAY:

- Find all `AVAILABLE` delivery agents
- Find all `WAITING` parcels (sorted by creation time)

WHILE both available agents and waiting parcels exist:

- Assign the next available agent to the next waiting parcel
- Update the parcel status to `DISPATCHED`
- Log a tracking event: "Parcel picked up from sender"
- Mark the agent as `BUSY` and update their `currentParcelId` and `assignedParcels`

---

## When a Delivery Agent Comes Back Online

IF delivery agent status changes to `AVAILABLE`:

- Find all `WAITING` parcels (sorted by creation time)

IF there is at least one waiting parcel:

- Pick the earliest waiting parcel
- Log a tracking event: "Parcel picked up from sender"
- Assign this parcel to the delivery agent
- Update parcel status to `DISPATCHED`
- Update delivery agent:
  - Set `currentParcelId` to parcel ID
  - Mark agent as `BUSY`
  - Add parcel ID to `assignedParcels`

# View Parcels by Role

---

## View All Sender Parcels

**Endpoint:**  
`GET https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/all-sender-parcel`

**Headers:**  
`Authorization: <access_token>`

---

## Receiver - View Incoming Parcels

**Endpoint:**  
`GET https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/incoming-parcels`

**Headers:**  
`Authorization: <access_token>`

---

## Receiver - View Delivered Parcels

**Endpoint:**  
`GET https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/delivered-parcels`

**Headers:**  
`Authorization: <access_token>`

---

## Admin - View All Parcels

**Endpoint:**  
`GET https://parcel-delivery-system-backend-one.vercel.app/api/v1/parcel/admin/all-parcels`

**Headers:**  
`Authorization: <access_token>`

