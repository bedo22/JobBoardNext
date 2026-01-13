# 🏁 The Gatekeeper: Next.js 16 Proxy Engine

The `src/proxy.ts` file is the project's **Network Boundary**. In Next.js 16, this replaces the legacy `middleware.ts` to provide a cleaner, more performant way to intercept and augment edge traffic.

## 🎯 Why this isn't "Overcomplication"
While it might seem "extra," our implementation follows the **Principle of Single Responsibility**:
- **Zero App Clutter**: Security headers and request tracing are handled in *one* file, rather than being repeated in every layout or page component.
- **Minimal Performance Impact**: The logic is written in lightweight TypeScript and runs in the Edge Runtime (at the data center closest to the user), adding negligible latency (<1ms).

---

## 🚀 Key Capabilities

### 1. 🛡️ Edge Security Hardening
Instead of relying on third-party libraries, we use the Proxy to inject production-grade security headers directly into the response stream:
- **HSTS (Strict-Transport-Security)**: Forces HTTPS for 2 years.
- **X-Frame-Options**: Prevents clickjacking by disabling iFrame embedding from other domains.
- **X-Content-Type-Options**: Disables MIME-sniffing, forcing the browser to respect our files' actual types.
- **Permissions-Policy**: Proactively disables browser features like Camera and Microphone to ensure user privacy.

### 2. 🕵️ Request-ID Tracing (Observability)
Every incoming request receives an `X-Request-ID`. 
- **Usage**: If a user reports an error, you can find the exact logs associated with that specific interaction by searching for this unique UUID.
- **Senior Marker**: This is how enterprise-scale observability works (OpenTelemetry style).

### 3. 🚦 Session Management
It acts as the handshake engine between the browser and Supabase, ensuring that authentication tokens are refreshed seamlessly without the user ever seeing a "Session Expired" screen.

---

## 🛠️ How to Extend
To add a new capability (e.g., A/B Testing or Maintenance Mode), add a conditional check before the final `return response`:

```typescript
// Example: Simple Maintenance Mode
if (process.env.MAINTENANCE_MODE === 'true') {
  return NextResponse.rewrite(new URL('/maintenance', request.url));
}
```

---

## 🔍 Matching Logic
The Proxy is configured with a high-performance matcher:
`'/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'`

This ensures it **skips** all static assets (images, fonts, scripts) and only processes "Meaningful Requests."
