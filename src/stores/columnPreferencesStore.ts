import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserColumnPreference {
  columnOrder: string[];
  visibleColumns: string[];
  lastUpdated?: string;
}

interface ColumnPreferencesState {
  preferences: Record<string, UserColumnPreference>;

  // Actions
  getPreferences: (
    userId: string,
    queryId: string,
    defaultHeaders: string[]
  ) => UserColumnPreference;

  setPreferences: (
    userId: string,
    queryId: string,
    preference: { columnOrder: string[]; visibleColumns: string[] }
  ) => void;

  toggleColumn: (
    userId: string,
    queryId: string,
    column: string,
    defaultHeaders: string[]
  ) => void;

  reorderColumns: (
    userId: string,
    queryId: string,
    fromIndex: number,
    toIndex: number,
    currentOrder: string[]
  ) => void;

  moveColumn: (
    userId: string,
    queryId: string,
    sourceColumn: string,
    targetColumn: string,
    currentOrder: string[]
  ) => void;

  showAllColumns: (
    userId: string,
    queryId: string,
    allHeaders: string[]
  ) => void;

  hideAllColumns: (
    userId: string,
    queryId: string
  ) => void;

  resetPreferences: (
    userId: string,
    queryId: string,
    defaultHeaders: string[]
  ) => void;
}

// Memory fallback for SSR environments
const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const safeStorage = createJSONStorage(() =>
  typeof window !== 'undefined' ? window.localStorage : dummyStorage
);

export const useColumnPreferencesStore = create<ColumnPreferencesState>()(
  persist(
    (set, get) => ({
      preferences: {},

      getPreferences: (userId: string, queryId: string, defaultHeaders: string[]) => {
        const key = `${userId}::${queryId}`;
        const saved = get().preferences[key];

        if (saved && saved.columnOrder && saved.columnOrder.length > 0) {
          // Reconcile with available headers
          const validSavedOrder = saved.columnOrder.filter((c) =>
            defaultHeaders.includes(c)
          );
          const missingInSaved = defaultHeaders.filter(
            (c) => !validSavedOrder.includes(c)
          );
          const finalOrder = [...validSavedOrder, ...missingInSaved];

          const validVisible = (saved.visibleColumns || []).filter((c) =>
            defaultHeaders.includes(c)
          );
          const finalVisible =
            validVisible.length > 0 ? validVisible : defaultHeaders;

          return {
            columnOrder: finalOrder,
            visibleColumns: finalVisible,
            lastUpdated: saved.lastUpdated,
          };
        }

        return {
          columnOrder: [...defaultHeaders],
          visibleColumns: [...defaultHeaders],
        };
      },

      setPreferences: (userId, queryId, preference) => {
        const key = `${userId}::${queryId}`;
        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: {
              columnOrder: preference.columnOrder,
              visibleColumns: preference.visibleColumns,
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      toggleColumn: (userId, queryId, column, defaultHeaders) => {
        const key = `${userId}::${queryId}`;
        const current = get().getPreferences(userId, queryId, defaultHeaders);
        const isVisible = current.visibleColumns.includes(column);

        const newVisible = isVisible
          ? current.visibleColumns.filter((c) => c !== column)
          : [...current.visibleColumns, column];

        // Ensure at least one column remains visible if possible
        const finalVisible = newVisible.length === 0 ? [column] : newVisible;

        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: {
              columnOrder: current.columnOrder,
              visibleColumns: finalVisible,
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      reorderColumns: (userId, queryId, fromIndex, toIndex, currentOrder) => {
        if (
          fromIndex < 0 ||
          fromIndex >= currentOrder.length ||
          toIndex < 0 ||
          toIndex >= currentOrder.length ||
          fromIndex === toIndex
        ) {
          return;
        }

        const key = `${userId}::${queryId}`;
        const current = get().preferences[key] || {
          columnOrder: [...currentOrder],
          visibleColumns: [...currentOrder],
        };

        const newOrder = [...currentOrder];
        const [moved] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, moved);

        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: {
              columnOrder: newOrder,
              visibleColumns: current.visibleColumns || newOrder,
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      moveColumn: (userId, queryId, sourceColumn, targetColumn, currentOrder) => {
        if (sourceColumn === targetColumn) return;
        const fromIndex = currentOrder.indexOf(sourceColumn);
        const toIndex = currentOrder.indexOf(targetColumn);
        if (fromIndex !== -1 && toIndex !== -1) {
          get().reorderColumns(userId, queryId, fromIndex, toIndex, currentOrder);
        }
      },

      showAllColumns: (userId, queryId, allHeaders) => {
        const key = `${userId}::${queryId}`;
        const current = get().preferences[key] || {
          columnOrder: [...allHeaders],
          visibleColumns: [...allHeaders],
        };

        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: {
              columnOrder: current.columnOrder.length > 0 ? current.columnOrder : allHeaders,
              visibleColumns: [...allHeaders],
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      hideAllColumns: (userId, queryId) => {
        const key = `${userId}::${queryId}`;
        const current = get().preferences[key];
        if (!current || !current.columnOrder.length) return;

        // Keep first column so table doesn't disappear completely
        const keepFirst = [current.columnOrder[0]];

        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: {
              columnOrder: current.columnOrder,
              visibleColumns: keepFirst,
              lastUpdated: new Date().toISOString(),
            },
          },
        }));
      },

      resetPreferences: (userId, queryId, defaultHeaders) => {
        const key = `${userId}::${queryId}`;
        set((state) => {
          const next = { ...state.preferences };
          delete next[key];
          return { preferences: next };
        });
      },
    }),
    {
      name: 'nexux-column-preferences-v2',
      storage: safeStorage,
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);
