import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Ambil daftar transaksi dengan filter
export async function GET(req: Request) {
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

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const categoryId = searchParams.get("categoryId") || "";
        const type = searchParams.get("type") || "ALL"; // "ALL" | "INCOME" | "EXPENSE"
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const whereClause: any = {
            userId: user.id,
        };

        if (categoryId && categoryId !== "ALL") {
            whereClause.categoryId = categoryId;
        }

        if (type && type !== "ALL") {
            whereClause.category = {
                type: type.toUpperCase(),
            };
        }

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date.gte = new Date(`${startDate}T00:00:00.000Z`);
            }
            if (endDate) {
                whereClause.date.lte = new Date(`${endDate}T23:59:59.999Z`);
            }
        }

        if (search.trim()) {
            whereClause.OR = [
                { description: { contains: search, mode: "insensitive" } },
                { category: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            include: {
                category: true,
            },
            orderBy: {
                date: "desc",
            },
        });

        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
        console.error("[TRANSACTIONS_GET_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST: Tambah transaksi baru
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
        const { description, amount, categoryId, date } = body;

        if (!description || !amount || !categoryId || !date) {
            return NextResponse.json(
                { message: "Semua kolom wajib diisi (deskripsi, jumlah, kategori, tanggal)" },
                { status: 400 }
            );
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId: user.id,
                description,
                amount: parseFloat(amount),
                categoryId,
                date: new Date(date),
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            { message: "Transaksi berhasil dibuat", transaction },
            { status: 201 }
        );
    } catch (error) {
        console.error("[TRANSACTIONS_POST_ERROR]", error);
        return NextResponse.json({ message: "Gagal membuat transaksi" }, { status: 500 });
    }
}
