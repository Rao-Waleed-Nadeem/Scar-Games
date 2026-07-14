# Email Verification Signup Feature

## Foundation & Architecture

Version: 1.0

---

# 1. Feature Overview

## Feature Name

Email Verification Before Account Creation

---

## Objective

Replace the current signup process with an email verification flow that ensures a user owns the email address before an account is created.

The feature must integrate into the existing authentication system while preserving the current automatic login behavior after successful signup.

---

## Existing Authentication Flow

```
User
 │
 ▼
Signup Form
 │
 ▼
POST /users/signup
 │
 ▼
userController
 │
 ▼
userModel
 │
 ▼
Users Table
 │
 ▼
Generate JWT
 │
 ▼
Return Token
 │
 ▼
Frontend stores token
 │
 ▼
Current User API
 │
 ▼
User Logged In
```

---

## New Authentication Flow

```
User
 │
 ▼
Signup Form
 │
 ▼
POST /auth/signup
 │
 ▼
Validate Request
 │
 ▼
Generate OTP
 │
 ▼
Hash OTP
 │
 ▼
Store Temporary Signup
 │
 ▼
Send Email
 │
 ▼
Return Success
 │
 ▼
Navigate to Verify OTP Page
 │
 ▼
User Enters OTP
 │
 ▼
POST /auth/verify
 │
 ▼
Validate OTP
 │
 ▼
Create User
 │
 ▼
Generate JWT
 │
 ▼
Return Token
 │
 ▼
Frontend Stores Token
 │
 ▼
Fetch Current User
 │
 ▼
User Logged In
```

---

# 2. Functional Requirements

The implementation must satisfy the following requirements.

### FR-01

A user enters

- Username
- Email
- Password

on the signup page.

---

### FR-02

The backend validates

- required fields
- email format
- password rules
- duplicate email

before generating an OTP.

---

### FR-03

If validation succeeds

Backend

- generates OTP
- hashes OTP
- stores temporary signup information
- sends OTP email

No user account is created.

---

### FR-04

Frontend redirects to

```
/verify-email
```

---

### FR-05

User enters OTP.

---

### FR-06

Backend verifies

- OTP
- expiration
- email

---

### FR-07

If OTP is correct

Backend

- creates user
- deletes temporary verification record
- generates JWT
- returns authentication response

---

### FR-08

Frontend stores JWT exactly like current login.

No duplicate authentication logic will exist.

---

### FR-09

User is automatically logged in.

Behavior must remain identical to current signup.

Only the point at which JWT is generated changes.

---

### FR-10

Expired OTPs cannot be reused.

---

### FR-11

Old OTPs become invalid immediately after requesting a new OTP.

---

### FR-12

Only one active OTP may exist per email.

---

# 3. Non-Functional Requirements

## Code Quality

Follow existing project structure.

Do not introduce another architecture.

---

## Maintainability

Every file must have one responsibility.

No file should perform multiple unrelated jobs.

---

## Readability

Controller code should read like business logic.

Database queries belong only inside models.

SMTP belongs only inside email utility.

OTP logic belongs only inside OTP utility.

---

## Reusability

The email service must support future features without modification.

Examples

- password reset
- email change verification
- two-factor authentication
- welcome email

---

## Scalability

The feature must allow additional verification types without changing existing authentication flow.

---

# 4. High Level Architecture

```
Frontend
│
├── Signup.jsx
│
├── VerifyOTP.jsx
│
├── userThunk.js
│
└── userSlice.js

        │

        ▼

Backend Routes

authRoutes.js

        │

        ▼

authController.js

        │

        ├──────── otp.js

        ├──────── email.js

        ├──────── verificationModel.js

        └──────── userModel.js

                │

                ▼

SQL Server

EmailVerifications

Users
```

---

# 5. Project Structure Changes

## Existing Backend

```
Backend

src

controllers

models

routes

utils
```

---

## New Backend Structure

```
Backend
│
└── src
    │
    ├── controllers
    │      │
    │      ├── userController.js
    │      └── authController.js          NEW
    │
    ├── models
    │      │
    │      ├── userModel.js
    │      └── verificationModel.js       NEW
    │
    ├── routes
    │      │
    │      ├── userRoutes.js
    │      └── authRoutes.js              NEW
    │
    ├── utils
    │      │
    │      ├── db.js
    │      ├── email.js                   NEW
    │      └── otp.js                     NEW
    │
    └── server.js
```

---

## Frontend Structure

```
Frontend
│
└── src
    │
    ├── pages
    │      │
    │      ├── Signup.jsx
    │      └── VerifyOTP.jsx          NEW
    │
    ├── user.store
    │      │
    │      ├── userThunk.js
    │      └── userSlice.js
    │
    └── routes
           │
           └── AppRoutes.jsx
```

---

# 6. Files To Be Created

Backend

```
src/controllers/authController.js
```

Purpose

Coordinates signup verification workflow.

---

Backend

```
src/routes/authRoutes.js
```

Purpose

Defines authentication verification endpoints.

---

Backend

```
src/models/verificationModel.js
```

Purpose

Database operations for temporary email verification records.

---

Backend

```
src/utils/email.js
```

Purpose

Reusable email service.

---

Backend

```
src/utils/otp.js
```

Purpose

OTP generation, hashing and validation.

---

Frontend

```
src/pages/VerifyOTP.jsx
```

Purpose

OTP verification screen.

---

# 7. Files To Modify

Backend

```
src/server.js
```

Reason

Register new authentication routes.

---

Backend

```
src/models/userModel.js
```

Reason

Expose reusable createUser function if current signup logic cannot be reused directly.

---

Frontend

```
src/pages/Signup.jsx
```

Reason

Replace account creation request with OTP request.

---

Frontend

```
src/user.store/userThunk.js
```

Reason

Add OTP-related API calls.

---

Frontend

```
src/user.store/userSlice.js
```

Reason

Store verification state.

---

Frontend

```
src/routes/AppRoutes.jsx
```

Reason

Register VerifyOTP page.

# 8. File Responsibility Specification

This section defines the responsibility boundaries of every file involved in the feature.

A file must never perform responsibilities assigned to another file.

---

# Backend

---

## authRoutes.js

Location

```
Backend/src/routes/authRoutes.js
```

Purpose

Acts only as an HTTP route mapper.

Responsibilities

- Register authentication verification endpoints
- Apply middleware if required
- Forward requests to controller

Imports

- express
- authController

Called By

```
server.js
```

Calls

```
authController.js
```

Must Never

- Access database
- Generate OTP
- Send email
- Generate JWT
- Validate business logic

Maximum Responsibility

HTTP routing only.

---

## authController.js

Location

```
Backend/src/controllers/authController.js
```

Purpose

Coordinates the complete signup verification process.

Responsibilities

- Receive HTTP request
- Validate request body
- Check duplicate email
- Generate OTP
- Hash OTP
- Store temporary signup
- Send email
- Verify OTP
- Create user
- Generate JWT
- Return API response

Imports

```
verificationModel.js

userModel.js

otp.js

email.js

jsonwebtoken

bcrypt
```

Called By

```
authRoutes.js
```

Calls

```
verificationModel

userModel

otp.js

email.js
```

Must Never

- Write SQL queries
- Configure SMTP
- Generate HTML email manually
- Handle database connections

Maximum File Size

Approximately 300 lines.

If controller becomes larger, extract reusable business logic into utility/service functions.

---

## verificationModel.js

Location

```
Backend/src/models/verificationModel.js
```

Purpose

Performs all SQL operations for temporary verification records.

Responsibilities

Create verification

Update verification

Delete verification

Delete expired verification

Find verification

Check expiration

Replace old verification

Imports

```
db.js
```

Called By

```
authController.js
```

Returns

Database records only.

Must Never

Generate OTP

Hash passwords

Generate JWT

Send email

Know about Express request or response objects.

---

## userModel.js

Current Responsibility

User CRUD operations.

Additional Responsibility

Expose reusable user creation method.

The new authController will reuse this method.

Signup-specific business logic must not remain duplicated.

---

## otp.js

Location

```
Backend/src/utils/otp.js
```

Purpose

Contains every OTP-related operation.

Responsibilities

Generate OTP

Hash OTP

Compare OTP

Generate expiration timestamp

Generate expiration duration

Exports

```
generateOTP()

hashOTP()

compareOTP()

getOTPExpiry()
```

Imports

bcrypt

crypto (optional)

Must Never

Read database

Send email

Generate JWT

Know about Express

Know about SQL Server

Pure utility only.

---

## email.js

Location

```
Backend/src/utils/email.js
```

Purpose

Centralized email service.

Responsibilities

Create transporter

Send verification email

Future email support

Exports

```
sendVerificationOTP()

sendWelcomeEmail()

sendPasswordReset()

sendEmail()
```

Imports

nodemailer

Called By

authController.js

Future

password reset

email change

welcome email

notifications

Must Never

Generate OTP

Access database

Generate JWT

---

# Frontend

---

## Signup.jsx

Current Responsibility

Collect signup information.

New Responsibility

Collect signup information

Call OTP request endpoint

Navigate to VerifyOTP page

Must Never

Verify OTP

Store OTP

Generate timers

Automatically create users

---

## VerifyOTP.jsx

Purpose

Handle OTP verification UI.

Responsibilities

Display email

Receive OTP

Submit OTP

Resend OTP

Display countdown

Display errors

Redirect after success

Imports

Redux thunk

Navigate

Timer utility (if needed)

Must Never

Call axios directly if project already uses Redux thunks.

---

## userThunk.js

Responsibilities

requestSignupOTP()

verifySignupOTP()

resendSignupOTP()

Current functions

login()

logout()

currentUser()

remain unchanged.

---

## userSlice.js

Additional State

```
signupEmail

otpLoading

otpVerified

otpExpiry

otpError

resendLoading

verificationStatus
```

Must Never

Store OTP value.

Only UI state.

---

## AppRoutes.jsx

New Route

```
/verify-email
```

No additional business logic.

Only route registration.

---

# 9. Dependency Matrix

```
server.js

↓

authRoutes.js

↓

authController.js

├──────────── otp.js

├──────────── email.js

├──────────── verificationModel.js

└──────────── userModel.js

↓

SQL Server
```

Dependency Rules

Routes know Controllers.

Controllers know Models and Utilities.

Models know Database.

Utilities know Libraries.

Database knows nothing.

No reverse dependency is allowed.

---

# 10. Complete Data Flow

## Step 1

User opens Signup page.

```
Signup.jsx
```

↓

User enters

username

email

password

↓

Clicks Signup

↓

Redux dispatch

```
requestSignupOTP()
```

↓

userThunk

↓

Axios

↓

POST

```
/auth/signup
```

↓

authRoutes

↓

authController

↓

Validate request

↓

Check duplicate email

↓

Generate OTP

↓

Hash OTP

↓

verificationModel.create()

↓

Database

↓

email.sendVerificationOTP()

↓

SMTP

↓

Email sent

↓

Controller returns

```
{
success:true,
email,
expiresIn
}
```

↓

Redux fulfilled

↓

Navigate

```
/verify-email
```

---

# Verification Flow

User enters OTP.

↓

VerifyOTP.jsx

↓

Redux

↓

verifySignupOTP()

↓

Axios

↓

POST

```
/auth/verify
```

↓

authRoutes

↓

authController

↓

verificationModel.find()

↓

Compare OTP

↓

Check expiration

↓

Create user

↓

Delete verification record

↓

Generate JWT

↓

Return

```
{
token,
user
}
```

↓

Redux stores token

↓

currentUser()

↓

Navigate Home

---

# 11. Database Design

New Table

```
EmailVerifications
```

Purpose

Temporary signup storage.

The Users table must remain unchanged.

Columns

```
verification_id

email

username

password_hash

otp_hash

expires_at

created_at
```

Relationships

No foreign keys.

Independent temporary table.

Lifecycle

Create

↓

Update (resend)

↓

Verify

↓

Delete

OR

Expire

↓

Delete

Never keep completed verification records.

---

# 12. API Contract

POST

```
/auth/signup
```

Request

```json
{
  "username": "",
  "email": "",
  "password": ""
}
```

Success

```json
{
  "success": true,
  "message": "Verification code sent.",
  "email": "",
  "expiresIn": 300
}
```

Failure

400

Invalid request

409

Email already exists

429

Too many requests

500

Email sending failed

---

POST

```
/auth/verify
```

Request

```json
{
  "email": "",
  "otp": ""
}
```

Success

```json
{
  "success": true,
  "token": "",
  "user": {}
}
```

Failure

400

Wrong OTP

410

OTP expired

404

Verification record not found

---

POST

```
/auth/resend
```

Request

```json
{
  "email": ""
}
```

Success

```json
{
  "success": true
}
```

---

# 13. Coding Rules

Controllers

Business logic only.

Models

SQL only.

Utilities

Reusable functions only.

Routes

Routing only.

Pages

UI only.

Redux

State management only.

Never mix responsibilities.

---

# 14. Feature Boundaries

This feature must not modify

```
Games

Inventory

Orders

Payments

Cart

Admin Dashboard
```

Only authentication-related files may be changed.

---

# 15. AI Context Rules

Whenever using an AI to implement a milestone:

Always provide:

- Project README
- This architecture document
- Only the files listed for that milestone

Never provide unrelated files.

Maximum recommended files per AI request:

3 source files

This keeps context focused and reduces incorrect modifications.

---

# Part 1 Status

Foundation & Architecture Document Complete.

Next Document

```
docs/signup-email-verification/01-Implementation-Milestones.md
```

This document will contain the complete implementation plan divided into approximately 15 independent milestones.

Each milestone will be designed so it can be completed independently by any AI with only 2–3 project files plus this architecture document.
