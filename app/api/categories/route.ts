import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
    { name: "Salary", type: "INCOME" },
    { name: "Investment", type: "INCOME" },
    { name: "Freelance", type: "INCOME" },
    { name: "Housing", type: "EXPENSE" },
    { name: "Food", type: "EXPENSE" },
    { name: "Transportation", type: "EXPENSE" },
    { name: "Shopping", type: "EXPENSE" },
    { name: "Entertainment", type: "EXPENSE" },
    { name: "Utilities", type: "EXPENSE" },
    { name: "Health", type: "EXPENSE" },
    { name: "Education", type: "EXPENSE" },
    { name: "Other", type: "EXPENSE" },
];

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

        // Ambil kategori global (userId: null) atau milik user ini
        let categories = await prisma.category.findMany({
            where: {
                OR: [
                    { userId: null },
                    { userId: user.id },
                ],
            },
            orderBy: { name: "asc" },
        });

        // Jika belum ada kategori sama sekali di database, inisialisasi default
        if (categories.length === 0) {
            await prisma.category.createMany({
                data: DEFAULT_CATEGORIES.map(c => ({
                    name: c.name,
                    type: c.type,
                    userId: null,
                })),
                skipDuplicates: true,
            });

            categories = await prisma.category.findMany({
                where: {
                    OR: [
                        { userId: null },
                        { userId: user.id },
                    ],
                },
                orderBy: { name: "asc" },
            });
        }

        return NextResponse.json({ categories }, { status: 200 });
    } catch (error) {
        console.error("[CATEGORIES_GET_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
