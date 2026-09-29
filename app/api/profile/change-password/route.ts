import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validasi panjang password baru
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password baru minimal 8 karakter." },
        { status: 400 }
      );
    }

    // Validasi kesesuaian konfirmasi password
    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "Konfirmasi password tidak cocok." },
        { status: 400 }
      );
    }

    // Ambil user dari database untuk mendapatkan passwordHash saat ini
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
    }

    // Jika user sudah memiliki password di database, verifikasi currentPassword
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "Password saat ini wajib diisi." },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: "Password saat ini tidak sesuai dengan yang ada di database." },
          { status: 400 }
        );
      }

      // Cegah penggunaan password baru yang sama persis dengan password lama
      const isSameAsOld = await bcrypt.compare(newPassword, user.passwordHash);
      if (isSameAsOld) {
        return NextResponse.json(
          { message: "Password baru tidak boleh sama dengan password saat ini." },
          { status: 400 }
        );
      }
    }

    // Hash password baru dan simpan ke database
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json(
      { message: "Password berhasil diperbarui." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengubah password." },
      { status: 500 }
    );
  }
}
