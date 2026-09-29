import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Ambil data user yang sedang login dari database
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                image: true,
                settings: true,
                createdAt: true,
                passwordHash: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { passwordHash, ...userWithoutPassword } = user;

        return NextResponse.json({
            user: {
                ...userWithoutPassword,
                hasPassword: Boolean(passwordHash),
            },
        }, { status: 200 });
    } catch (error) {
        console.error("[PROFILE_GET_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// PUT: Simpan perubahan data profil
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, phone, dateOfBirth } = body;

        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                image: true,
            },
        });

        return NextResponse.json({ message: "Profil berhasil diperbarui", user: updatedUser });
    } catch (error) {
        console.error("[PROFILE_UPDATE_ERROR]", error);
        return NextResponse.json({ message: "Gagal memperbarui profil" }, { status: 500 });
    }
}
