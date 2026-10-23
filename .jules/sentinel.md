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

## 2024-05-18 - [MEDIUM] Secure Error Handling for JSON Parsing
**Vulnerability:** The Express server used `app.use(express.json())` which, by default, threw a raw `SyntaxError` when receiving malformed JSON payloads. This error was unhandled by custom middleware, leaking an HTML stack trace back to the client and potentially exposing internal framework details.
**Learning:** Default framework behaviors often fall back to verbose HTML error pages. For APIs, any error during middleware processing (like body parsing) should be caught and transformed into a safe, generic JSON response to prevent information leakage.
**Prevention:** Implement a global error-handling middleware `(err, req, res, next)` after all API routes but before other middleware (like Vite). Check if the error is a `SyntaxError` from `body-parser` and return a generic 400 JSON response, taking care to check `res.headersSent` to prevent crashing.

## 2026-07-19 - [MEDIUM] JSON Parsing Stack Trace Leakage on Non-API Routes
**Vulnerability:** The Express global error handler was checking `req.path.startsWith('/api/')` *before* checking for JSON `SyntaxError`s from `body-parser`. If a malformed JSON payload was sent to a non-API route, it bypassed the custom error handler, falling through to Vite's middleware or Express's default handler, which leaked raw HTML stack traces exposing internal framework details.
**Learning:** Error handling middleware must consider the order of conditional checks. Checking for global formatting errors (like JSON syntax) should precede route-specific filters to ensure uniform, safe error responses across the entire application domain.
**Prevention:** When catching parsing errors from global middleware like `app.use(express.json())`, place the type/instance checks (e.g., `err instanceof SyntaxError`) at the very top of the error handler, before applying any path-based filtering, to catch and safely format all payload errors globally.
