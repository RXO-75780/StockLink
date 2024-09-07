import { create } from "zustand";

const useStockStore = create((set) => ({
  symbol: "", // Initial state for the symbol
  setSymbol: (newSymbol) => set({ symbol: newSymbol }),

  stockData: {}, // Initialize as an object
  setStockData: (filename, newData) =>
    set((state) => ({
      stockData: { ...state.stockData, [filename]: newData },
    })),
  fileName: [], // Initialize as an array
  setFilename: (newFile) =>
    set((state) => ({
      fileName: [...state.fileName, newFile],
    })),

  drawerOpen: false,
  toggleDrawer: () => set((state) => ({ drawerOpen: !state.drawerOpen })),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
}));

export default useStockStore;
