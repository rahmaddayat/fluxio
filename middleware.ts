import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Custom middleware handler
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/budgets/:path*",
    "/goals/:path*",
    "/settings/:path*",
  ],
};
