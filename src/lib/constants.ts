// Kept dependency-free (no jsonwebtoken import) so it's safe to use from
// Edge Runtime code like middleware.ts, which can't use Node-only APIs.
export const AUTH_COOKIE_NAME = "book_manager_token";
