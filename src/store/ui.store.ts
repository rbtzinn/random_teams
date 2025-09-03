import { create } from 'zustand';

interface UIState {
    isRosterModalOpen: boolean;
    openRosterModal: () => void;
    closeRosterModal: () => void;
    isRosterSelectorModalOpen: boolean; // Novo
    openRosterSelectorModal: () => void; // Novo
    closeRosterSelectorModal: () => void; // Novo
}

export const useUIStore = create<UIState>((set) => ({
    isRosterModalOpen: false,
    openRosterModal: () => set({ isRosterModalOpen: true }),
    closeRosterModal: () => set({ isRosterModalOpen: false }),

    isRosterSelectorModalOpen: false,
    openRosterSelectorModal: () => set({ isRosterSelectorModalOpen: true }),
    closeRosterSelectorModal: () => set({ isRosterSelectorModalOpen: false }),
}));

