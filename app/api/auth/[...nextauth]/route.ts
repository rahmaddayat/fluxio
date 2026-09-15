import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// NextAuth membutuhkan handler untuk GET dan POST
export { handler as GET, handler as POST };
