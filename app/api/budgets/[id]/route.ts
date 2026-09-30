import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PUT: Perbarui data budget (limitAmount, categoryId, period)
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
        const { categoryId, limitAmount, period } = body;

        const existing = await prisma.budget.findFirst({
            where: { id, userId: user.id },
        });

        if (!existing) {
            return NextResponse.json({ message: "Budget tidak ditemukan" }, { status: 404 });
        }

        const updated = await prisma.budget.update({
            where: { id },
            data: {
                categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
                limitAmount: limitAmount !== undefined ? parseFloat(limitAmount) : existing.limitAmount,
                period: period !== undefined ? period.toUpperCase() : existing.period,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json({ message: "Budget berhasil diperbarui", budget: updated });
    } catch (error) {
        console.error("[BUDGET_PUT_ERROR]", error);
        return NextResponse.json({ message: "Gagal memperbarui budget" }, { status: 500 });
    }
}

// DELETE: Hapus data budget
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

        const existing = await prisma.budget.findFirst({
            where: { id, userId: user.id },
        });

        if (!existing) {
            return NextResponse.json({ message: "Budget tidak ditemukan" }, { status: 404 });
        }

        await prisma.budget.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Budget berhasil dihapus" }, { status: 200 });
    } catch (error) {
        console.error("[BUDGET_DELETE_ERROR]", error);
        return NextResponse.json({ message: "Gagal menghapus budget" }, { status: 500 });
    }
}
