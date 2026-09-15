import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // Gunakan JWT untuk menyimpan session (tidak perlu tabel session di DB)
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Validasi input tidak boleh kosong
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi.");
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Jika user tidak ditemukan
        if (!user) {
          throw new Error("Email atau password salah.");
        }

        // Jika user terdaftar via Google dan belum memiliki password manual
        if (!user.passwordHash) {
          throw new Error("GOOGLE_ONLY_ACCOUNT");
        }

        // Bandingkan password yang diinput dengan hash di database
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Email atau password salah.");
        }

        // Return data user yang akan disimpan di token JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // Saat login via Google, buat akun jika belum ada atau tautkan ke akun yang cocok
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Buat akun baru otomatis tanpa password
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Google User",
              image: user.image,
              passwordHash: null,
            },
          });
        } else {
          // Jika akun sudah ada, perbarui foto jika kosong
          if (!existingUser.image && user.image) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { image: user.image },
            });
          }
        }
      }
      return true;
    },

    // Saat JWT dibuat/diperbarui, simpan user ID yang konsisten dari DB
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.picture = dbUser.image;
        }
      }
      return token;
    },

    // Saat session diakses di frontend, tambahkan id dari token ke session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/login", // Redirect ke halaman login buatan sendiri
  },
};

