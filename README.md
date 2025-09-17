# Parcel Delivery System Backend API

## 🎯 Project Overview

The **Parcel Delivery System Backend API** is a comprehensive, production-ready logistics management platform built with **Express.js**, **TypeScript**, and **Mongoose**. This system revolutionizes parcel delivery operations by providing a complete end-to-end solution from parcel creation to delivery confirmation.

### What Problem Does It Solve?

Traditional delivery systems often suffer from:
- Manual parcel assignment leading to delays and inefficiencies
- Lack of real-time tracking and status updates
- Poor role-based access control
- Inconsistent delivery agent management
- Limited automation in logistics workflows

### Key Differentiators

🚀 **Smart Automation**: Automatic parcel assignment to available delivery agents  
🔄 **Intelligent Reassignment**: Auto-assigns waiting parcels when agents become available  
📊 **Comprehensive Tracking**: Detailed status logs with location, timestamp, and role-based updates  
🛡️ **Advanced Security**: JWT-based authentication with role-specific route protection  
💳 **Payment Integration**: SSLCommerz payment gateway integration  
⚡ **Real-time Updates**: Live status tracking for all stakeholders

This system eliminates the need for manual dispatch operations while maintaining full administrative control when needed.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Security** | bcrypt |
| **Validation** | Zod Schema Validation |
| **Payment Gateway** | SSLCommerz |
| **Development** | ts-node-dev, ESLint |
| **Deployment** | Vercel |
| **API Testing** | Postman |

---

## 🎭 Role-Based Features

### 👤 **Sender**
- Create parcel delivery requests
- Edit parcel information (before dispatch)
- Cancel parcels (before pickup)
- Track all sent parcels with detailed status logs
- View delivery history and status updates

### 📦 **Receiver** 
- View incoming parcels with tracking information
- Confirm parcel delivery upon receipt
- Access delivery history and past confirmations
- Track parcel status in real-time

### 🚚 **Delivery Agent**
- View assigned parcels automatically
- Update parcel status during transit (Picked Up → On The Way → Delivered)
- Manage availability status (Online/Offline)
- View delivery statistics and completed deliveries

### 👨‍💼 **Admin/Super Admin**
- **Zero Manual Assignment**: System automatically assigns parcels to available agents
- **Smart Queue Management**: Waiting parcels auto-assigned when agents come online
- Approve/Block parcel requests
- Manage user accounts (block/unblock)
- View comprehensive system analytics
- Override parcel assignments when needed
- Access all system data with advanced filtering

### 🤖 **Automated Features (No Admin Intervention Required)**

1. **Smart Parcel Assignment**: When a parcel is approved, system automatically finds and assigns available delivery agents
2. **Queue Management**: If no agents available, parcel goes to "WAITING" status and auto-assigns when agent becomes available
3. **Agent Availability Tracking**: When agent completes delivery, they're automatically marked available for new assignments
4. **Intelligent Reassignment**: System continuously monitors for available agents and waiting parcels, auto-matching them
5. **Status Flow Automation**: Automatic status transitions based on role actions without manual intervention

---

## 📁 File Structure

```
src/
├── app.ts                          # Express app configuration
├── server.ts                       # Server startup and database connection
└── app/
    ├── config/
    │   └── env.config.ts          # Environment variables configuration
    ├── errorHelper/               # Custom error handling utilities
    │   ├── AppError.ts           # Custom error class
    │   ├── handleCastError.ts    # MongoDB cast error handler
    │   ├── handleDuplicateError.ts # Duplicate key error handler
    │   └── handlerZodError.ts    # Zod validation error handler
    ├── middleware/               # Express middleware functions
    │   ├── globalErrorHandler.ts # Global error handling middleware
    │   ├── roleBasedAccess.ts    # JWT authentication & role authorization
    │   └── validateZodSchema.ts  # Zod schema validation middleware
    ├── modules/                  # Feature-based modules
    │   ├── auth/                 # Authentication & authorization
    │   ├── user/                 # User management (all roles)
    │   ├── parcel/               # Parcel lifecycle management
    │   ├── payment/              # Payment processing
    │   └── sslCommerz/           # SSLCommerz payment gateway integration
    ├── utility/                  # Helper functions
    │   ├── calculateFee.ts       # Delivery fee calculation
    │   ├── jwtTokens.ts          # JWT token generation/verification
    │   ├── statusFlow.ts         # Parcel status transition logic
    │   └── createTrackingId.ts   # Unique tracking ID generation
    └── route.ts                  # Main route configuration
```

---

## 🔗 API Endpoints by Role

### 🔐 **Authentication (Public)**
- `POST /api/v1/auth/login` - User login with email/password
- `POST /api/v1/auth/logout` - User logout and clear cookies
- `POST /api/v1/auth/refresh-token` - Generate new access token using refresh token
- `PATCH /api/v1/auth/change-password` - Change user password (requires old password)

### 👥 **User Management**
- `POST /api/v1/user/register` - Register new user (Sender/Receiver/Delivery Agent)
- `PATCH /api/v1/user/:id` - Update user profile information
- `GET /api/v1/user/get-me` - Get current user profile details

### 👤 **Sender Endpoints**
- `POST /api/v1/parcel/create-parcel` - Create new parcel delivery request
- `GET /api/v1/parcel/all-sender-parcel` - View all parcels sent by current user
- `PATCH /api/v1/parcel/:trackingId` - Edit parcel information (before dispatch)
- `PATCH /api/v1/parcel/status/:trackingId` - Cancel parcel (before pickup)

### 📦 **Receiver Endpoints**
- `GET /api/v1/parcel/incoming-parcels` - View all parcels being delivered to receiver
- `GET /api/v1/parcel/delivered-parcels` - View all successfully delivered parcels
- `PATCH /api/v1/parcel/status/:trackingId` - Confirm parcel delivery receipt

### 🚚 **Delivery Agent Endpoints**
- `GET /api/v1/parcel/admin/all-parcels` - View assigned parcels and available parcels
- `PATCH /api/v1/parcel/status/:trackingId` - Update parcel status (Picked Up/On The Way/Delivered)
- `PATCH /api/v1/user/update-available-status/:id` - Update availability status (Online/Offline)

### 👨‍💼 **Admin/Super Admin Endpoints**
- `GET /api/v1/user/all-user` - View all users (Senders & Receivers)
- `GET /api/v1/user/all-delivery-agent` - View all delivery agents with statistics
- `GET /api/v1/parcel/admin/all-parcels` - View all parcels with advanced filtering
- `GET /api/v1/parcel/single-parcel/:trackingId` - View detailed parcel information
- `PATCH /api/v1/parcel/status/:trackingId` - Approve/Block parcel requests
- `PATCH /api/v1/parcel/assign-delivery-agent/:trackingId` - Manually assign delivery agent (override automation)

### 💳 **Payment Endpoints**
- `POST /api/v1/payment/success` - Handle successful payment callback from SSLCommerz

---

## 🚀 Live API

**Base URL**: [https://parcel-delivery-system-backend-one.vercel.app](https://parcel-delivery-system-backend-one.vercel.app)

All endpoints require proper authentication headers except for registration, login, and payment callbacks.

**Authentication Header Format**: 
```
Authorization: Bearer <access_token>
```

---