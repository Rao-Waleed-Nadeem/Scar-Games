# Google Authentication

# 01 - Implementation Guide

Version: 1.0

Status: Planning

---

# Purpose

This document defines the implementation plan for Google Authentication.

Unlike the Email Verification feature, Google Authentication extends the existing authentication system rather than creating a new one.

The implementation is divided into independent phases so that:

- Every phase can be implemented separately.
- Every phase can be committed independently.
- Any AI assistant can work on one phase without understanding the entire project.
- Existing functionality remains protected throughout development.

---

# Implementation Principles

Every implementation phase must follow these rules.

- Implement only the current phase.
- Never implement future phases.
- Never refactor unrelated code.
- Reuse existing authentication logic whenever possible.
- Protect backward compatibility.
- Preserve Email Login.
- Preserve Email Verification Signup.
- Preserve JWT generation.
- Preserve Redux authentication state.

---

# Required Reading Order

Before implementing any phase, always read in this order.

1. README.md

2. Docs/google-authentication/00_Overview_Architecture.md

3. This document

4. Only the files listed in the current phase.

Never read unrelated files.

---

===============================================================================
PHASE 1
GOOGLE CLOUD CONFIGURATION
===============================================================================

## Objective

Prepare Google Cloud OAuth credentials.

No project code should be modified during this phase.

---

## Why

Google Authentication cannot be implemented until OAuth credentials are created.

This phase establishes the external authentication provider only.

---

## Files To Read

None

---

## Files To Modify

None

---

## Files To Create

None

---

## Do Not Touch

Entire Backend

Entire Frontend

Database

Redux

---

## Expected Work

- Create Google Cloud Project
- Configure OAuth Consent Screen
- Configure Authorized Origins
- Configure Redirect URI
- Generate Client ID
- Generate Client Secret

---

## Definition of Done

Google credentials are available.

No project code changed.

---

## Git Commit

No commit required.

---

===============================================================================
PHASE 2
BACKEND AUTHENTICATION SETUP
===============================================================================

## Objective

Prepare the backend for Google Authentication.

---

## Files To Read

README.md

authController.js

authRoutes.js

userModel.js

server.js

---

## Files To Modify

authController.js

authRoutes.js

server.js

.env.example (if exists)

---

## Files To Create

Only files required for Google authentication support.

---

## Files Not To Touch

Games

Orders

Payments

Inventory

Frontend

---

## Responsibilities

Backend should:

- Accept Google authentication requests
- Validate identity
- Reuse existing authentication architecture

Backend should NOT:

- Generate frontend UI
- Modify Redux
- Change existing login

---

## Risks

Breaking Email Login.

Breaking JWT generation.

Breaking existing routes.

---

## Definition of Done

Backend accepts Google authentication requests.

Existing login still works.

---

## Git Commit

Implement backend Google authentication foundation

---

===============================================================================
PHASE 3
DATABASE INTEGRATION
===============================================================================

## Objective

Integrate Google users into the existing Users table.

---

## Files To Read

schema.sql

userModel.js

authController.js

---

## Files To Modify

Only required database-related files.

---

## Files To Create

None unless absolutely necessary.

---

## Architecture Rules

Do NOT create:

GoogleUsers

OAuthUsers

SocialUsers

Use the existing Users table.

---

## Responsibilities

Locate user by email.

If user exists:

Return existing account.

If user does not exist:

Create new account.

---

## Definition of Done

Google users use the same database model as local users.

---

## Git Commit

Integrate Google authentication with existing user model

---

===============================================================================
PHASE 4
JWT INTEGRATION
===============================================================================

## Objective

Reuse existing JWT generation.

---

## Files To Read

authController.js

userController.js

JWT utilities

---

## Files To Modify

Only authentication files.

---

## Rules

Never create another JWT implementation.

Google Authentication must return exactly the same token structure.

---

## Expected Result

Email Login

↓

JWT

Google Login

↓

Same JWT

---

## Definition of Done

Both authentication methods produce identical authentication responses.

---

## Git Commit

Reuse existing JWT authentication

---

===============================================================================
PHASE 5
FRONTEND INTEGRATION
===============================================================================

## Objective

Integrate Google Login into the existing Login page.

---

## Files To Read

Login.jsx

userThunk.js

userSlice.js

AppRoutes.jsx

api.js

---

## Files To Modify

Login.jsx

Redux authentication files

Only files required for routing.

---

## Files To Create

Only if reusable components are necessary.

---

## Do Not Touch

Cart

Orders

Games

Payments

Inventory

OTP Pages

---

## Responsibilities

Frontend should:

Display Google Login option.

Handle authentication.

Store JWT.

Load current user.

Redirect user.

---

## Definition of Done

User can authenticate through Google.

Existing Email Login still works.

---

## Git Commit

Integrate Google Login into frontend authentication

---

===============================================================================
PHASE 6
TESTING
===============================================================================

## Objective

Verify Google Authentication without breaking existing authentication.

---

## Test Cases

Existing Email Login

Existing Signup

OTP Verification

Google Login

Google Existing User

Google New User

Logout

Current User

Protected Routes

Token Persistence

Browser Refresh

---

## Regression Testing

Games

Orders

Payments

Inventory

Cart

Admin

All must continue working.

---

## Definition of Done

All authentication flows succeed.

Regression tests pass.

---

## Git Commit

Complete Google authentication testing

---

===============================================================================
PHASE 7
DOCUMENTATION & CLEANUP
===============================================================================

## Objective

Finalize implementation.

---

## Update

README.md

Architecture documentation

Environment variables

API documentation

---

## Verify

No unused imports

No dead code

No duplicated authentication logic

No duplicated JWT generation

No unnecessary utilities

No broken routes

---

## Final Checklist

✓ Email Login works

✓ Email Verification works

✓ Google Login works

✓ JWT generation reused

✓ Existing database preserved

✓ Existing Redux preserved

✓ Existing routes preserved

✓ Existing authentication preserved

✓ Documentation updated

---

## Git Commit

Complete Google Authentication implementation

---

# AI Implementation Context Template

Every implementation request should begin with the following information.

---

READ

- README.md
- 00_Overview_Architecture.md
- Current implementation phase

MODIFY

- Only files listed in the current phase

CREATE

- Only if listed

DO NOT TOUCH

- Any unrelated modules

OBJECTIVE

- Complete only the current phase

SUCCESS CRITERIA

- Existing authentication remains functional
- Current phase completed
- No unrelated changes introduced

---

# Definition of Complete Feature

Google Authentication implementation is complete only when:

- Existing Email Login remains functional.
- Email Verification Signup remains functional.
- Google Login is fully operational.
- JWT generation is shared.
- Users table remains the single source of truth.
- Redux authentication remains unified.
- Existing APIs remain backward compatible.
- Documentation is updated.
- No unrelated modules are modified.
