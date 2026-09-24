## 2026-07-13 - [MEDIUM] Secure Input Validation and Error Handling
**Vulnerability:** API endpoints (`/api/terminal/chat` and `/api/terminal/image`) lacked length limits on the `prompt` input, which could lead to DoS by sending excessively large payloads to the LLM backend. Also, the catch blocks exposed raw exception messages `e.message` to the client, which could leak stack traces or internal backend details.
**Learning:** External user input should never be implicitly trusted. Passing unbound strings directly to external APIs like Gemini can cause resource exhaustion or API rate limiting. Furthermore, returning raw error messages violates the "fail securely" principle and leaks internal state.
**Prevention:** Always sanitize, validate, and enforce length limits (e.g. 2000 characters) on all user input. Ensure error responses return only generic, safe messages to the client while logging the detailed exception internally for debugging.

## 2024-05-18 - Missing Authentication on Public-Facing AI Endpoints
**Vulnerability:** The `/api/tarot` endpoint was completely unauthenticated, allowing anyone to call it and invoke the Gemini AI generation models.
**Learning:** This exposes the platform to potential abuse and cost overruns by bad actors repeatedly pinging the endpoint, depleting the generative API quota and racking up charges.
**Prevention:** Ensure that all endpoints interacting with paid, external APIs or intensive resource systems enforce `requireAuth` and handle unauthenticated access securely. Pass ID tokens consistently on the frontend whenever calling AI resources.

## 2026-07-15 - [HIGH] Missing Rate Limiting on AI Endpoints
**Vulnerability:** The AI generation endpoints (`/api/tarot`, `/api/terminal/chat`, `/api/terminal/image`) did not have rate limiting applied, which exposes the system to automated abuse and external API quota exhaustion.
**Learning:** Any endpoint that interacts with a third-party paid service or requires significant resources must be protected against abuse, even if it is authenticated, to prevent quota denial-of-service from malicious or compromised users.
**Prevention:** Apply strict rate limiting on all resource-heavy or external API-dependent endpoints. Use an in-memory store for basic protection or a distributed store like Redis for multi-node deployments.

## 2026-07-16 - [MEDIUM] Missing Security Headers
**Vulnerability:** The Express server lacked basic HTTP security headers (CSP, X-Frame-Options, HSTS, etc.), leaving the application vulnerable to clickjacking, MIME-sniffing, and cross-site scripting (XSS).
**Learning:** Relying solely on default Express settings is insufficient for production security. Frameworks like Express do not enforce security headers out of the box.
**Prevention:** Implement custom middleware or use libraries like Helmet to inject standard security headers globally for all incoming requests, configuring Content Security Policy (CSP) according to the app's specific resource needs.
## 2026-07-17 - Firebase Token Revocation Check & Input Validation
**Vulnerability:** Firebase `verifyIdToken` does not natively check if a token has been revoked or the user disabled unless explicitly configured via the second argument `true`.
**Learning:** Default validation bypasses real-time revocation checks, leaving an authentication window open for disabled users until the token organically expires. Missing strict string validations on inputs that pass configurations (like model configs).
**Prevention:** Pass `true` as the second argument to `adminAuth.verifyIdToken()` when full revocation checks are desired, and gracefully handle the `auth/id-token-revoked` error code. Implement server-side check for expected enum strings in Express routes.

## 2026-07-18 - [CRITICAL] Missing Firestore Security Rules
**Vulnerability:** The application writes directly to Firebase Firestore from the frontend client SDK (e.g., in `ArchiveTerminal.tsx`), but the repository was missing explicit Firestore security rules (`firestore.rules` and `firebase.json`). This lack of authorization checks could allow any authenticated user to read or modify another user's data.
**Learning:** When utilizing a BaaS (Backend-as-a-Service) like Firebase where clients interact directly with the database, strong client-side security rules must be defined and version-controlled to enforce row-level access control.
**Prevention:** Always include `firestore.rules` and `firebase.json` in the repository to define explicit access controls ensuring users can only read and write their own documents based on authentication UID matching.

## 2026-07-20 - [MEDIUM] Error Handling Exposing Stack Traces
**Vulnerability:** The application was lacking error handling for JSON parsing errors triggered by Express' `body-parser`. When an invalid JSON payload was sent to API endpoints, the server responded with a 400 Bad Request but included a full HTML stack trace (e.g. `SyntaxError: Unexpected end of JSON input`), leaking internal backend details.
**Learning:** Default Express error handling can inadvertently expose sensitive internal server state or stack traces to the client. This happens because default middleware behaviors (like `body-parser`'s parsing logic) bubble up unhandled errors directly to the client unless explicitly intercepted.
**Prevention:** Implement custom global error-handling middleware specifically designed to catch these parsing errors (e.g., checking `err instanceof SyntaxError` with a 400 status) and return generic JSON error messages like `{"error": "Invalid JSON payload"}` instead of internal exceptions. Place this middleware after API routes but before fallback routes (like Vite development middleware) to capture errors effectively.
