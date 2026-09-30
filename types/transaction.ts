export interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE' | string;
    userId?: string | null;
}

export interface Transaction {
    id: string;
    userId: string;
    categoryId: string;
    amount: number | string;
    date: string | Date;
    description: string;
    category?: Category;
}
