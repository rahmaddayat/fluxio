import { Category } from './transaction';

export type BudgetPeriod = 'DAILY' | 'MONTHLY' | 'YEARLY';

export interface Budget {
    id: string;
    userId: string;
    categoryId: string;
    limitAmount: number | string;
    period: BudgetPeriod | string;
    category?: Category;
    spentAmount?: number;
    percentage?: number;
}
