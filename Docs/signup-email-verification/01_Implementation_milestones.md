# Email Verification Signup Feature

# Implementation Milestones

Version 1.0

---

# Overview

This document breaks the Email Verification Signup feature into independent implementation milestones.

Each milestone has one responsibility.

Each milestone should be completed, tested and committed before moving to the next milestone.

Every milestone is intentionally designed so another AI can continue implementation without reading the whole project.

---

# Global Rules

Every milestone follows these rules.

## Maximum Files

Maximum source files per AI request

```
3
```

Maximum documentation files

```
2
```

Maximum project areas

```
One
```

Never ask AI to modify Backend and Frontend together unless the milestone explicitly requires it.

---

# Branch Strategy

Recommended Branch

```
feature/email-verification-signup
```

Never implement directly on main.

---

# Commit Strategy

Commit after every completed milestone.

Never combine multiple milestones into one commit.

---

# Milestone M01

## Name

Create Email Verification Database Table

---

## Objective

Create the database table used to temporarily store signup information before account creation.

---

## Current State

Users are inserted directly into Users table.

No temporary verification table exists.

---

## Target State

Temporary signup information is stored separately.

Users table remains unchanged.

---

## Files To Read

```
Backend/database/schema.sql
```

---

## Files To Modify

```
Backend/database/schema.sql
```

---

## Files To Create

None

---

## Files NOT To Touch

```
Controllers

Routes

Models

Frontend

Utils
```

---

## Database Changes

Create

```
EmailVerifications
```

Columns

```
verification_id

username

email

password_hash

otp_hash

expires_at

created_at
```

---

## Constraints

Email should be unique.

OTP should never be stored in plain text.

Password should already be hashed.

---

## Do NOT

Create foreign keys.

Modify Users table.

Modify Orders.

Modify Payments.

---

## Validation

Database builds successfully.

Table exists.

Indexes created.

---

## Definition Of Done

Database setup executes without errors.

EmailVerifications table exists.

---

## Git Commit

```
Create EmailVerifications table
```

---

## AI Context Package

Read

```
schema.sql
```

Modify

```
schema.sql
```

Ignore

Everything else.

---

# Milestone M02

## Name

Create OTP Utility

---

## Objective

Create reusable OTP utility.

---

## Current State

OTP generation does not exist.

---

## Target State

Utility exports reusable OTP functions.

---

## Files To Read

None

---

## Files To Create

```
Backend/src/utils/otp.js
```

---

## Files To Modify

None

---

## Dependencies

None

---

## Responsibilities

Generate OTP

Hash OTP

Compare OTP

Calculate expiry

Generate expiry timestamp

---

## Required Exports

```
generateOTP()

hashOTP()

compareOTP()

getExpiryTime()
```

---

## Must Never

Access SQL

Send email

Generate JWT

Import Express

---

## Validation

Utility functions independently.

---

## Definition Of Done

All exports available.

No project dependencies.

---

## Git Commit

```
Create OTP utility
```

---

## AI Context Package

Read

None

Modify

```
otp.js
```

Ignore

Entire project.

---

# Milestone M03

## Name

Create Email Utility

---

## Objective

Create reusable email service.

---

## Current State

No centralized email service.

---

## Target State

Single reusable email utility.

---

## Files To Read

None

---

## Files To Create

```
Backend/src/utils/email.js
```

---

## Dependencies

```
nodemailer
```

---

## Required Exports

```
sendVerificationOTP()

sendEmail()
```

---

## Future Ready

Password reset

Welcome email

Email change

Notifications

---

## Must Never

Generate OTP

Read database

Generate JWT

---

## Validation

Send test email successfully.

---

## Definition Of Done

Email utility reusable.

---

## Git Commit

```
Create email utility
```

---

## AI Context Package

Read

None

Modify

```
email.js
```

Ignore

Everything else.

---

# Milestone M04

## Name

Create Verification Model

---

## Objective

Implement all database operations for EmailVerifications.

---

## Files To Read

```
Backend/src/utils/db.js
```

---

## Files To Create

```
Backend/src/models/verificationModel.js
```

---

## Files NOT To Touch

```
Controllers

Routes

Frontend
```

---

## Responsibilities

Create verification

Find verification

Delete verification

Delete expired

Replace verification

Update verification

---

## Must Never

Generate OTP

Hash passwords

Send email

Generate JWT

---

## Validation

Every method returns expected SQL results.

---

## Definition Of Done

CRUD completed.

---

## Git Commit

```
Create verification model
```

---

## AI Context Package

Read

```
db.js
```

Modify

```
verificationModel.js
```

Ignore

Entire frontend.

---

# Milestone M05

## Name

Create Authentication Routes

---

## Objective

Register verification endpoints.

---

## Files To Read

```
Backend/src/routes/userRoutes.js
```

---

## Files To Create

```
Backend/src/routes/authRoutes.js
```

---

## Files NOT To Touch

Controllers

Models

Frontend

---

## Routes

```
POST /auth/signup

POST /auth/verify

POST /auth/resend
```

---

## Controller References

Use placeholders only.

Controller implementation comes later.

---

## Validation

Routes registered.

Server starts.

---

## Definition Of Done

Endpoints exist.

No logic.

---

## Git Commit

```
Create authentication routes
```

---

## AI Context Package

Read

```
userRoutes.js
```

Modify

```
authRoutes.js
```

Ignore

Everything else.

---

# Milestone M06

## Name

Register Authentication Routes

---

## Objective

Mount auth routes into server.

---

## Files To Read

```
Backend/src/server.js
```

---

## Files To Modify

```
Backend/src/server.js
```

---

## Responsibilities

Import authRoutes.

Mount routes.

Nothing else.

---

## Validation

Server boots.

Endpoints accessible.

---

## Definition Of Done

/auth routes available.

---

## Git Commit

```
Register authentication routes
```

---

## AI Context Package

Read

```
server.js
```

Modify

```
server.js
```

Ignore

Entire frontend.

---

# Milestone M07

## Name

Create Authentication Controller Skeleton

---

## Objective

Create controller structure without business logic.

---

## Files To Read

None

---

## Files To Create

```
Backend/src/controllers/authController.js
```

---

## Required Methods

```
signup()

verifyOTP()

resendOTP()
```

---

## Current Logic

None.

Return placeholder responses only.

No implementation.

---

## Must Never

Write SQL.

Generate OTP.

Send email.

Generate JWT.

---

## Validation

Routes execute.

Controller loads.

No runtime errors.

---

## Definition Of Done

Controller skeleton completed.

---

## Git Commit

```
Create authentication controller skeleton
```

---

## AI Context Package

Read

None

Modify

```
authController.js
```

Ignore

Entire backend except routes.

---

# Milestone M08

## Name

Implement Signup Request Validation

---

## Objective

Validate every signup request before any OTP generation or database operation.

---

## Current State

Controller contains only placeholder methods.

---

## Target State

Signup endpoint validates request body and returns appropriate validation errors.

No OTP generation.

No database writes.

No email sending.

---

## Files To Read

```
Backend/src/controllers/authController.js
```

---

## Files To Modify

```
Backend/src/controllers/authController.js
```

---

## Files NOT To Touch

```
Routes

Models

Frontend

Database

OTP Utility

Email Utility
```

---

## Validation Rules

Username

- Required
- Minimum length according to existing project
- Maximum length according to existing project

Email

- Required
- Valid email format

Password

- Required
- Existing password policy only

---

## Response Codes

400

Missing field

400

Invalid email

400

Weak password

---

## Output

Either

Validation Error

or

Continue to next milestone.

---

## Definition Of Done

Controller performs validation only.

Nothing else.

---

## Git Commit

```
Implement signup validation
```

---

## AI Context Package

Read

```
authController.js
```

Modify

```
authController.js
```

Ignore

Everything else.

---

# Milestone M09

## Name

Check Duplicate Email

---

## Objective

Prevent verification request if account already exists.

---

## Current State

Validation completed.

---

## Target State

Controller checks Users table before generating OTP.

---

## Files To Read

```
authController.js

userModel.js
```

---

## Files To Modify

```
authController.js
```

---

## Dependencies

```
userModel
```

---

## Workflow

Validate

↓

Check email

↓

Email exists?

↓

Yes

Return 409

↓

No

Continue

---

## Response

409

Email already registered.

---

## Must Never

Generate OTP.

Send email.

Store verification.

---

## Definition Of Done

Duplicate accounts blocked.

---

## Git Commit

```
Add duplicate email validation
```

---

## AI Context Package

Read

```
authController.js

userModel.js
```

Modify

```
authController.js
```

Ignore

Everything else.

---

# Milestone M10

## Name

Generate Signup OTP

---

## Objective

Generate secure OTP after validation succeeds.

---

## Files To Read

```
authController.js

otp.js
```

---

## Files To Modify

```
authController.js
```

---

## Dependencies

```
otp.js
```

---

## Workflow

Validation

↓

Duplicate Check

↓

Generate OTP

↓

Hash OTP

↓

Generate Expiry

↓

Return values to controller

---

## Output

Controller now has

```
OTP

Hashed OTP

Expiry Time
```

Nothing saved yet.

---

## Must Never

Access database.

Send email.

Generate JWT.

---

## Definition Of Done

OTP generated successfully.

---

## Git Commit

```
Generate signup OTP
```

---

## AI Context Package

Read

```
authController.js

otp.js
```

Modify

```
authController.js
```

Ignore

Everything else.

---

# Milestone M11

## Name

Store Verification Record

---

## Objective

Save temporary signup information.

---

## Files To Read

```
authController.js

verificationModel.js
```

---

## Files To Modify

```
authController.js

verificationModel.js
```

---

## Data Stored

Username

Email

Password Hash

OTP Hash

Expiry

Created Time

---

## Workflow

Generate OTP

↓

Store verification

↓

Database success

↓

Continue

---

## Rules

Existing verification for same email

↓

Replace it

Only one active verification record per email.

---

## Must Never

Create User.

Generate JWT.

Send Email.

---

## Definition Of Done

Verification record saved.

---

## Git Commit

```
Store signup verification
```

---

## AI Context Package

Read

```
authController.js

verificationModel.js
```

Modify

```
authController.js

verificationModel.js
```

Ignore

Frontend.

---

# Milestone M12

## Name

Send Verification Email

---

## Objective

Send OTP after successful database save.

---

## Files To Read

```
authController.js

email.js
```

---

## Files To Modify

```
authController.js
```

---

## Dependencies

```
email.js
```

---

## Workflow

Verification saved

↓

Send Email

↓

Success

↓

Continue

Failure

↓

Return Error

---

## Response

500

Email failed.

Verification record should not remain active if email sending fails.

Controller must clean temporary data before returning error.

---

## Must Never

Generate OTP.

Create User.

Generate JWT.

---

## Definition Of Done

OTP email successfully delivered.

---

## Git Commit

```
Send verification email
```

---

## AI Context Package

Read

```
authController.js

email.js
```

Modify

```
authController.js
```

Ignore

Everything else.

---

# Milestone M13

## Name

Complete Signup Endpoint

---

## Objective

Return successful signup response after email is sent.

---

## Files To Read

```
authController.js
```

---

## Files To Modify

```
authController.js
```

---

## Response

```json
{
  "success": true,
  "message": "Verification code sent.",
  "email": "",
  "expiresIn": 300
}
```

---

## Frontend Expectation

Navigate

```
/verify-email
```

using returned email.

---

## Must Never

Return JWT.

Create User.

Login User.

---

## Definition Of Done

Signup endpoint fully completed.

---

## Git Commit

```
Complete signup endpoint
```

---

## AI Context Package

Read

```
authController.js
```

Modify

```
authController.js
```

Ignore

Entire frontend.

---

# Milestone M14

## Name

Implement Verify OTP Validation

---

## Objective

Validate Verify OTP request before checking database.

---

## Files To Read

```
authController.js
```

---

## Files To Modify

```
authController.js
```

---

## Validation Rules

Email

Required

Valid email format

OTP

Required

Numeric only

Exactly project-defined length

---

## Response Codes

400

Missing Email

400

Missing OTP

400

Invalid OTP Format

---

## Workflow

Receive Request

↓

Validate

↓

Continue to verification logic

---

## Must Never

Query database before validation succeeds.

---

## Definition Of Done

Verify endpoint performs validation only.

---

## Git Commit

```
Validate verify OTP request
```

---

## AI Context Package

Read

```
authController.js
```

Modify

```
authController.js
```

Ignore

Everything else.

---

# Milestone M15

## Name

Implement OTP Verification Logic

---

## Objective

Verify the submitted OTP against the stored verification record.

---

## Files To Read

```
authController.js

verificationModel.js

otp.js
```

---

## Files To Modify

```
authController.js
```

---

## Files NOT To Touch

```
Frontend

Routes

Users Table

JWT Logic
```

---

## Workflow

Receive email

↓

Find verification record

↓

Record exists?

↓

No

Return 404

↓

Yes

↓

Check expiration

↓

Expired?

↓

Yes

Delete verification record

↓

Return 410

↓

No

↓

Compare OTP hash

↓

Match?

↓

No

Return 400

↓

Yes

Continue

---

## Response Codes

404

Verification record not found

400

Incorrect OTP

410

OTP expired

---

## Expected Output

Controller now has verified temporary signup data.

User account is still NOT created.

---

## Definition Of Done

OTP verification succeeds only for valid, unexpired OTPs.

---

## Git Commit

```
Implement OTP verification
```

---

## AI Context Package

Read

```
authController.js

verificationModel.js

otp.js
```

Modify

```
authController.js
```

Ignore

Frontend

---

# Milestone M16

## Name

Create User Account

---

## Objective

Create a permanent user after successful OTP verification.

---

## Files To Read

```
authController.js

userModel.js

verificationModel.js
```

---

## Files To Modify

```
authController.js

userModel.js
```

---

## Workflow

Verified OTP

↓

Read temporary signup data

↓

Create user

↓

Insert into Users table

↓

Success

↓

Delete verification record

---

## Rules

Delete temporary verification only after successful user creation.

Never leave duplicate records.

Never create the user twice.

---

## Expected Output

Permanent user exists.

Temporary verification record removed.

---

## Definition Of Done

Verified signup creates exactly one user.

---

## Git Commit

```
Create user after verification
```

---

## AI Context Package

Read

```
authController.js

userModel.js

verificationModel.js
```

Modify

```
authController.js

userModel.js
```

Ignore

Frontend

---

# Milestone M17

## Name

Generate JWT And Automatic Login

---

## Objective

Preserve existing automatic login behavior after successful verification.

---

## Files To Read

```
authController.js

userController.js
```

---

## Files To Modify

```
authController.js
```

---

## Workflow

User created

↓

Generate JWT

↓

Return token

↓

Return user

---

## Response

```json
{
  "success": true,
  "token": "...",
  "user": {}
}
```

---

## Rules

Reuse the same JWT generation logic already used by Login.

Do not create a second authentication implementation.

Authentication flow after verification must match Login.

---

## Definition Of Done

Verified users receive JWT and are immediately authenticated.

---

## Git Commit

```
Generate JWT after verification
```

---

## AI Context Package

Read

```
authController.js

userController.js
```

Modify

```
authController.js
```

Ignore

Everything else.

---

# Milestone M18

## Name

Implement Resend OTP

---

## Objective

Allow users to request a new OTP.

---

## Files To Read

```
authController.js

verificationModel.js

otp.js

email.js
```

---

## Files To Modify

```
authController.js
```

---

## Workflow

Receive email

↓

Find verification

↓

Record exists?

↓

No

Return 404

↓

Generate new OTP

↓

Hash OTP

↓

Update verification record

↓

Send email

↓

Return success

---

## Rules

Previous OTP becomes invalid immediately.

Only one OTP remains active.

Optional resend cooldown may be added later.

---

## Response

```json
{
  "success": true,
  "message": "New verification code sent."
}
```

---

## Definition Of Done

Resend endpoint fully functional.

---

## Git Commit

```
Implement resend OTP
```

---

## AI Context Package

Read

```
authController.js

verificationModel.js

otp.js

email.js
```

Modify

```
authController.js
```

Ignore

Frontend

---

# Milestone M19

## Name

Frontend Integration

---

## Objective

Integrate the new backend flow into the frontend.

---

## Files To Read

```
Signup.jsx

userThunk.js

userSlice.js

AppRoutes.jsx
```

---

## Files To Create

```
VerifyOTP.jsx
```

---

## Files To Modify

```
Signup.jsx

userThunk.js

userSlice.js

AppRoutes.jsx
```

---

## Implementation Tasks

### Signup.jsx

Replace direct signup request with OTP request.

After success

Navigate

```
/verify-email
```

Pass email using project's preferred navigation/state approach.

---

### VerifyOTP.jsx

Implement

- OTP input
- Verify button
- Resend button
- Countdown timer
- Error messages
- Loading states

---

### userThunk.js

Add

```
requestSignupOTP()

verifySignupOTP()

resendSignupOTP()
```

Reuse existing Axios instance.

---

### userSlice.js

Add verification state only.

Never store OTP value.

---

### AppRoutes.jsx

Register

```
/verify-email
```

---

## Rules

Do not modify Login.

Do not modify Logout.

Do not modify Protected Routes.

---

## Definition Of Done

Frontend fully supports email verification signup.

---

## Git Commit

```
Integrate frontend email verification flow
```

---

## AI Context Package

Read

```
Signup.jsx

VerifyOTP.jsx

userThunk.js

userSlice.js

AppRoutes.jsx
```

Modify

Only these files.

Ignore

Backend

---

# Milestone M20

## Name

Cleanup And Final Verification

---

## Objective

Prepare feature for merge.

---

## Files To Review

```
authController.js

verificationModel.js

email.js

otp.js

Signup.jsx

VerifyOTP.jsx

userThunk.js

userSlice.js
```

---

## Cleanup Checklist

Remove debug logs.

Remove commented code.

Remove unused imports.

Remove duplicate functions.

Ensure naming consistency.

Verify response format consistency.

Verify error message consistency.

Verify HTTP status consistency.

---

## Regression Checklist

Existing Login works.

Existing Logout works.

Protected routes work.

JWT validation works.

Current user endpoint works.

Games module unaffected.

Orders unaffected.

Payments unaffected.

Admin unaffected.

---

## Manual Acceptance Tests

✓ New user receives OTP.

✓ Wrong OTP rejected.

✓ Expired OTP rejected.

✓ Correct OTP creates account.

✓ User automatically logged in.

✓ Resend OTP works.

✓ Old OTP invalid.

✓ Duplicate email blocked.

✓ Refresh after login still authenticated.

✓ Existing login still functional.

---

## Definition Of Done

Feature passes all acceptance tests.

No existing functionality broken.

No duplicate code introduced.

Architecture remains consistent with project standards.

---

## Git Commit

```
Complete email verification signup feature
```

---

## AI Context Package

Read

Architecture document

Current milestone

Modified project files only

Perform

Review

Cleanup

Regression verification

No new features

No refactoring outside authentication.

---

# Implementation Order Summary

```
M01  Database Table
M02  OTP Utility
M03  Email Utility
M04  Verification Model
M05  Auth Routes
M06  Register Routes
M07  Controller Skeleton
M08  Signup Validation
M09  Duplicate Email Check
M10  Generate OTP
M11  Store Verification
M12  Send Email
M13  Complete Signup Endpoint
M14  Verify Request Validation
M15  Verify OTP
M16  Create User
M17  Generate JWT
M18  Resend OTP
M19  Frontend Integration
M20  Cleanup & Regression
```

---

# Feature Completion Criteria

The feature is considered complete only when all of the following are true:

- No user account is created before email verification.
- Exactly one active verification record exists per email.
- OTPs are hashed and expire automatically.
- Users are automatically logged in after successful verification using the existing authentication flow.
- All authentication-related logic remains within the authentication module.
- No unrelated modules are modified.
- Existing login/logout functionality remains unchanged.
- The implementation follows the architecture defined in `00-Foundation-And-Architecture.md`.
