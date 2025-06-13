import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdTime: string;
}

interface FinanceState {
  transactions: Transaction[];
  categories: string[];
  isLoading: boolean;

  addTransaction: (
    transaction: Omit<Transaction, 'id' | 'createdTime'>
  ) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setLoading: (loading: boolean) => void;

  getMonthlyStats: () => {
    income: number;
    expense: number;
    net: number;
  };
}

export const useFinanceStore = create<FinanceState>()(
  devtools(
    persist(
      (set, get) => ({
        transactions: [],
        categories: [
          'Food',
          'Transport',
          'Amusement',
          'Shopping',
          'Supplies',
          'Travel',
          'Medical',
          'Salary',
          'Investment',
          'Other',
        ],
        isLoading: false,

        addTransaction: transaction => {
          const newTransaction: Transaction = {
            ...transaction,
            id: crypto.randomUUID(),
            createdTime: new Date().toISOString(),
          };

          set(state => ({
            transactions: [newTransaction, ...state.transactions],
          }));
        },

        updateTransaction: (id, updates) => {
          set(state => ({
            transactions: state.transactions.map(t =>
              t.id === id ? { ...t, ...updates } : t
            ),
          }));
        },

        deleteTransaction: id => {
          set(state => ({
            transactions: state.transactions.filter(t => t.id !== id),
          }));
        },

        addCategory: category => {
          set(state => ({
            categories: [...state.categories, category],
          }));
        },

        updateCategory: (oldName, newName) => {
          set(state => ({
            categories: state.categories.map(cat =>
              cat === oldName ? newName : cat
            ),
            // 同時更新所有交易中的分類名稱
            transactions: state.transactions.map(t =>
              t.category === oldName ? { ...t, category: newName } : t
            ),
          }));
        },

        deleteCategory: category => {
          set(state => ({
            categories: state.categories.filter(cat => cat !== category),
            // 可選：刪除分類時，將相關交易改為 "Other"
            transactions: state.transactions.map(t =>
              t.category === category ? { ...t, category: 'Other' } : t
            ),
          }));
        },

        setLoading: loading => set({ isLoading: loading }),

        getMonthlyStats: () => {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const monthlyTransactions = get().transactions.filter(t => {
            const date = new Date(t.date);
            return (
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear
            );
          });

          const income = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

          const expense = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

          return { income, expense, net: income - expense };
        },
      }),
      {
        name: 'finance-storage',
      }
    ),
    {
      name: 'FinanceStore', // 加上 devtools 名稱
    }
  )
);
