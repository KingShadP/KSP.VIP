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
