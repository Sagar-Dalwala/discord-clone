import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be protected
const isProtectedRoute = createRouteMatcher([
  "/", // Assuming "/" is a protected route
  // "!/sign-in(.*)", // Exclude /sign-in and its children
  // "!/api/uploadthing(.*)", // Exclude /api/uploadthing and its children
  // "!/sign-in",
  // "!/sign-up",

  // Add more protected routes here
]);

// Update clerkMiddleware to manually protect routes
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect(); // Manually protect routes
  }
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

