## Project Impact Analysis

Feature:
Google Authentication

Estimated Difficulty:
Medium

Affected Layers:

- Backend
- Frontend
- Authentication

Expected Files Modified:
6–10

Expected Files Created:
0–3

Risk Level:
Medium

Potential Regression:

- Login
- JWT
- Current User

Regression Prevention:

- Reuse existing JWT
- Preserve auth routes
- Do not modify unrelated Redux state
- Test existing email login after every phase
