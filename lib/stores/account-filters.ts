import { create } from 'zustand';

type AccountFilterState = {
  search: string;
  tier: string;
  setSearch: (search: string) => void;
  setTier: (tier: string) => void;
};

export const useAccountFilters = create<AccountFilterState>((set) => ({
  search: '',
  tier: 'all',
  setSearch: (search) => set({ search }),
  setTier: (tier) => set({ tier })
}));
