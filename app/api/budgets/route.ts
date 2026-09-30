import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper untuk mendapatkan rentang waktu periode berjalan (Daily / Monthly / Yearly)
function getPeriodDateRange(period: string) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const date = now.getDate();

    let startDate: Date;
    let endDate: Date;

    const normalizedPeriod = (period || "MONTHLY").toUpperCase();

    if (normalizedPeriod === "DAILY") {
        // Hari ini
        startDate = new Date(Date.UTC(year, month, date, 0, 0, 0, 0));
        endDate = new Date(Date.UTC(year, month, date, 23, 59, 59, 999));
    } else if (normalizedPeriod === "YEARLY") {
        // Tahun ini
        startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
        endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
    } else {
        // Default: Bulan ini (MONTHLY)
        startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
        endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
    }

    return { startDate, endDate };
}

// GET: Ambil daftar budget beserta total pengeluaran aktual sesuai periode (Daily / Monthly / Yearly)
export async function GET() {
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

        const budgets = await prisma.budget.findMany({
            where: {
                userId: user.id,
            },
            include: {
                category: true,
            },
            orderBy: {
                limitAmount: "desc",
            },
        });

        // Hitung total pengeluaran aktual dari tabel Transaction berdasarkan masing-masing periode
        const budgetsWithSpending = await Promise.all(
            budgets.map(async (b) => {
                const { startDate, endDate } = getPeriodDateRange(b.period || "MONTHLY");

                const totalExpense = await prisma.transaction.aggregate({
                    where: {
                        userId: user.id,
                        categoryId: b.categoryId,
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

                const spent = totalExpense._sum.amount ? parseFloat(totalExpense._sum.amount.toString()) : 0;
                const limit = parseFloat(b.limitAmount.toString());
                const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;

                return {
                    ...b,
                    limitAmount: limit,
                    spentAmount: spent,
                    percentage,
                };
            })
        );

        return NextResponse.json({ budgets: budgetsWithSpending }, { status: 200 });
    } catch (error) {
        console.error("[BUDGETS_GET_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST: Buat budget baru (dengan pilihan periode: DAILY | MONTHLY | YEARLY)
export async function POST(req: Request) {
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

        const body = await req.json();
        const { categoryId, limitAmount, period } = body;

        if (!categoryId || !limitAmount || !period) {
            return NextResponse.json(
                { message: "Semua data (kategori, batas nominal, periode) wajib diisi" },
                { status: 400 }
            );
        }

        const normalizedPeriod = period.toUpperCase(); // "DAILY" | "MONTHLY" | "YEARLY"

        // Cek apakah budget untuk kategori dan periode tersebut sudah ada
        const existing = await prisma.budget.findFirst({
            where: {
                userId: user.id,
                categoryId,
                period: normalizedPeriod,
            },
        });

        if (existing) {
            const periodLabel = normalizedPeriod === "DAILY" ? "Harian (Daily)" : normalizedPeriod === "YEARLY" ? "Tahunan (Yearly)" : "Bulanan (Monthly)";
            return NextResponse.json(
                { message: `Budget untuk kategori ini dengan periode ${periodLabel} sudah ada` },
                { status: 400 }
            );
        }

        const newBudget = await prisma.budget.create({
            data: {
                userId: user.id,
                categoryId,
                limitAmount: parseFloat(limitAmount),
                period: normalizedPeriod,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            { message: "Budget berhasil dibuat", budget: newBudget },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("[BUDGETS_POST_ERROR]", error);
        return NextResponse.json({ message: error?.message || "Gagal membuat budget" }, { status: 500 });
    }
}
