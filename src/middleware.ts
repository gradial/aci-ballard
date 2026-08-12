import { createGradialMiddleware } from '@gradial/aci/next/middleware';

export default createGradialMiddleware();

// The matcher value below is inlined for Next.js static analysis compatibility.
// Source of truth: aciMiddlewareMatcher from '@gradial/aci/next/middleware'.
// The conformance check verifies this stays in sync with the SDK export.
export const config = {
  matcher: ['/((?!_next(?:/|$)|api(?:/|$)|favicon\\.ico$|\\.gradial-dam(?:/|$)).*)'],
};
