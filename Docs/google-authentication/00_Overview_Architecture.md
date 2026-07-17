# Google Authentication

# 00 - Overview & Architecture

Version: 1.0

Status: Planning

---

# Purpose

This document defines the architecture for implementing **Google Authentication** within the Game Store project.

It explains how Google Authentication integrates into the existing authentication system without replacing or breaking the current Email + Password login and Email Verification OTP signup flow.

This document must be read before implementing any milestone.

Implementation details are intentionally excluded from this document and are covered in:

```

01_Implementation_Guide.md

```

---

# Objectives

The implementation must:

- Allow users to sign in using their Google account.
- Reuse the existing authentication architecture whenever possible.
- Generate the same JWT used by Email/Password login.
- Return the same frontend user object regardless of login method.
- Keep Google Authentication independent from Email Verification OTP.
- Preserve all existing functionality.
- Maintain a single authentication system rather than creating parallel implementations.

---

# Non-Objectives

This feature does NOT include:

- Google Drive integration
- Google Calendar integration
- Google One Tap
- Password reset
- Email change verification
- Two-Factor Authentication
- Social account linking
- Multiple OAuth providers

Those may be implemented in future features.

---

# Existing Authentication System

The current authentication system consists of two independent user flows.

## 1. Email & Password Login

Existing users authenticate using:

Email

↓

Password

↓

JWT

↓

Authenticated Session

---

## 2. Email Verification Signup

New users register through:

Signup Form

↓

Generate OTP

↓

Email Verification

↓

Create User

↓

Generate JWT

↓

Authenticated Session

---

# Authentication Philosophy

Regardless of how a user authenticates, the application should produce the same result.

Different authentication methods should never produce different user models or different authorization logic.

Every successful authentication method must eventually produce:

- User
- JWT
- Authenticated Redux State
- Protected Route Access

The authentication provider should only determine **how identity is verified**, not how the application behaves afterward.

---

# Authentication Providers

After this feature, the system will support three authentication providers.

Authentication

├── Email + Password Login
│
├── Email Verification Signup
│
└── Google OAuth Login

All providers converge into the same authentication pipeline.

---

# High-Level Authentication Flow

                    Authentication

          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼

Email Login Email Signup Google Login

          │              │              │

          └──────────────┬──────────────┘

                         ▼

                Identity Verified

                         ▼

                 Retrieve/Create User

                         ▼

                   Generate JWT

                         ▼

                 Return User + Token

                         ▼

              Frontend Stores JWT

                         ▼

               Fetch Current User

                         ▼

                Authenticated Session

---

# Why Google Authentication?

Google OAuth provides several advantages.

- Faster registration
- Fewer forgotten passwords
- Trusted identity provider
- Better user experience
- Reduced fake accounts
- Industry-standard authentication

It also removes the need for users to create another password.

---

# Integration Strategy

Google Authentication is an extension of the current authentication system.

It should not introduce:

- another authentication architecture
- another Redux store
- another JWT implementation
- another user model

Instead, it should reuse the existing system.

Current Authentication Layer

↓

Add Google Provider

↓

Reuse Existing JWT

↓

Reuse Existing User Model

↓

Reuse Existing Authorization

---

# Architecture Principles

## Principle 1

Single Authentication System

There must only be one authentication system.

Google Authentication is another entry point into the same system.

---

## Principle 2

Single JWT Generation

JWT generation should happen in one place.

Email Login

↓

Google Login

↓

Same JWT Logic

---

## Principle 3

Single User Model

The Users table remains the single source of truth.

Every authenticated user must exist inside the Users table.

No separate GoogleUsers table should be introduced.

---

## Principle 4

Provider Independence

The application should not care whether authentication came from:

- Email
- Google

After authentication succeeds, both users behave identically.

---

## Principle 5

Minimal Code Duplication

Reuse existing:

- JWT generation
- User retrieval
- Current user endpoint
- Authorization middleware
- Redux state
- Protected routes

Avoid creating duplicate logic.

---

# User Types

The system will now support two user origins.

## Local Account

Created through Email Verification Signup.

Uses:

- Email
- Password

---

## Google Account

Created automatically after successful Google authentication.

Uses:

- Google Identity
- Verified Google Email

No password is required.

---

# Existing User Scenarios

Scenario 1

Existing Local Account

↓

Logs in using Email & Password

↓

No change

---

Scenario 2

New Google User

↓

Google Authentication

↓

User does not exist

↓

Create User

↓

Generate JWT

↓

Login

---

Scenario 3

Existing Google User

↓

Google Authentication

↓

User exists

↓

Generate JWT

↓

Login

---

# Authentication Decision Flow

User clicks Login

↓

Choose Provider

↓

Email Login

or

Google Login

↓

Identity Verified

↓

Locate User

↓

User Exists?

↓

Yes

↓

Generate JWT

↓

Login

OR

No

↓

Create User

↓

Generate JWT

↓

Login

---

# Existing Components That Will Be Reused

Backend

- authController
- userModel
- JWT generation
- Authentication middleware
- Existing response format

Frontend

- Redux userSlice
- Redux userThunk
- Login page
- Current User fetch
- Protected routes
- Axios instance

No duplicate authentication architecture should be introduced.

---

# Existing Components That Should Remain Unchanged

This feature must not modify unrelated modules.

Examples include:

Games

Inventory

Orders

Payments

Cart

Admin

These modules must continue working exactly as before.

---

# Data Ownership

Google is responsible only for:

- User identity verification

The application remains responsible for:

- JWT
- Authorization
- Roles
- Database
- Orders
- Payments
- User Profile

Google should never become the application's authorization system.

---

# Security Considerations

The implementation must ensure:

- Google ID tokens are verified.
- Emails are trusted only after Google verification.
- JWT secrets remain internal.
- No Google secrets are exposed to the frontend.
- OAuth credentials are stored in environment variables.
- Tokens are transmitted securely.

---

# Environment Variables

Google Authentication introduces new environment variables.

Examples include:

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

GOOGLE_CALLBACK_URL

The exact values are implementation-specific and will be documented later.

---

# Error Philosophy

Authentication failures should return consistent API responses.

Examples include:

- Invalid Google token
- Expired Google token
- Missing email
- Existing conflicting account
- Internal authentication failure

Frontend error handling should remain consistent with the current authentication flow.

---

# Future Extensibility

The authentication architecture should allow additional providers without significant refactoring.

Potential future providers include:

- GitHub
- Facebook
- Microsoft
- Apple

The authentication pipeline should remain unchanged regardless of provider.

---

# Dependencies

Before implementing Google Authentication, the following documentation should already be understood:

- README.md
- Signup Email Verification Documentation
- Master Implementation Prompt

---

# Next Document

Continue with:

```

01_Implementation_Guide.md

```

This document explains every implementation phase, affected files, architecture decisions, responsibilities, testing expectations, and AI implementation context.
