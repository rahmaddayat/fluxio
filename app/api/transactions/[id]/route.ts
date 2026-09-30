import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT: Perbarui transaksi
export async function PUT(req: Request, context: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { id } = await context.params;
        const body = await req.json();
        const { description, amount, categoryId, date } = body;

        // Pastikan transaksi milik user yang sedang login
        const existing = await prisma.transaction.findFirst({
            where: { id, userId: user.id },
        });

        if (!existing) {
            return NextResponse.json({ message: "Transaksi tidak ditemukan" }, { status: 404 });
        }

        const updated = await prisma.transaction.update({
            where: { id },
            data: {
                description: description !== undefined ? description : existing.description,
                amount: amount !== undefined ? parseFloat(amount) : existing.amount,
                categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
                date: date !== undefined ? new Date(date) : existing.date,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json({ message: "Transaksi berhasil diperbarui", transaction: updated });
    } catch (error) {
        console.error("[TRANSACTION_PUT_ERROR]", error);
        return NextResponse.json({ message: "Gagal memperbarui transaksi" }, { status: 500 });
    }
}

// DELETE: Hapus transaksi
export async function DELETE(req: Request, context: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { id } = await context.params;

        const existing = await prisma.transaction.findFirst({
            where: { id, userId: user.id },
        });

        if (!existing) {
            return NextResponse.json({ message: "Transaksi tidak ditemukan" }, { status: 404 });
        }

        await prisma.transaction.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Transaksi berhasil dihapus" }, { status: 200 });
    } catch (error) {
        console.error("[TRANSACTION_DELETE_ERROR]", error);
        return NextResponse.json({ message: "Gagal menghapus transaksi" }, { status: 500 });
    }
}
