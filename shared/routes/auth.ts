// shared/routes/auth.ts
// Authentication domain routes

export const authRoutes = {
  login: () => '/login',
  register: () => '/register',
  verifyEmail: (id: string, hash: string) => `/verify-email/${id}/${hash}`,
  googleCallback: () => '/auth/google/callback',
} as const;
