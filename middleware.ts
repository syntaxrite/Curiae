// hello
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about(.*)",
  "/rights(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk",
]);

const isWebhookRoute = createRouteMatcher(["/api/webhooks/clerk"]);

export default clerkMiddleware((auth, req) => {
  // Allow Clerk webhook requests through without auth checks.
  if (isWebhookRoute(req)) return;

  // In current Clerk middleware types, `auth.protect()` is not available.
  // Use the supported sync guard instead.
  if (!isPublicRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
