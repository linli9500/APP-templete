import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'history-storage',
});

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

export interface ReportData {
  id: string;
  createdAt: string;
  content: string;
  birthDate: string;
  birthTime?: string;
  gender?: string;
  summary?: string; // 简短摘要，用于列表显示
}

interface HistoryState {
  reports: Record<string, ReportData>;
  addReport: (report: ReportData) => void;
  removeReport: (id: string) => void;
  setReports: (reports: Record<string, ReportData>) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      reports: {},
      addReport: (report) =>
        set((state) => ({
          reports: { ...state.reports, [report.id]: report },
        })),
      removeReport: (id) =>
        set((state) => {
          const newReports = { ...state.reports };
          delete newReports[id];
          return { reports: newReports };
        }),
      setReports: (reports) => set({ reports }),
      clear: () => set({ reports: {} }),
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
