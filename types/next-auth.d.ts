import "next-auth";

// Extend tipe bawaan NextAuth agar session.user.id tersedia
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
