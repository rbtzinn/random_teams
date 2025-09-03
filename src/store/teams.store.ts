import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player } from '../services/team.services';
import { generateBalancedTeams, parsePlayerList } from '../services/team.services';

interface TeamsState {
    players: Player[];
    numTeams: number;
    teamNames: string[];
    teams: Player[][];
    seed: string;
    loadPlayersFromText: (text: string) => void;
    addPlayersToSession: (newPlayers: Player[]) => void; // Novo
    updatePlayerLevel: (playerIndex: number, newLevel: number) => void;
    removePlayer: (index: number) => void;
    setNumTeams: (count: number) => void;
    setTeamName: (index: number, newName: string) => void;
    generateTeams: () => void;
    setSeed: (seed: string) => void;
    clearAll: () => void;
}

export const useTeamsStore = create<TeamsState>()(
    persist(
        (set, get) => ({
            players: [],
            numTeams: 2,
            teamNames: [],
            teams: [],
            seed: '',

            loadPlayersFromText: (text) => {
                const newPlayers = parsePlayerList(text);
                set({ players: newPlayers, teams: [] });
            },

            addPlayersToSession: (newPlayers) => {
                set((state) => {
                    const currentPlayers = state.players;
                    const existingPlayerIds = new Set(currentPlayers.map(p => p.id));
                    const playersToAdd = newPlayers.filter(p => !existingPlayerIds.has(p.id));
                    return { players: [...currentPlayers, ...playersToAdd] };
                });
            },

            updatePlayerLevel: (playerIndex, newLevel) => {
                set((state) => {
                    const newPlayers = [...state.players];
                    if (newPlayers[playerIndex]) {
                        newPlayers[playerIndex].level = newLevel;
                    }
                    return { players: newPlayers };
                });
            },
            
            removePlayer: (index: number) => {
                set((state) => {
                    const newPlayers = [...state.players];
                    newPlayers.splice(index, 1);
                    return { players: newPlayers, teams: [] };
                });
            },

            setNumTeams: (count) => {
                if (count >= 2) {
                    set((state) => ({
                        numTeams: count,
                        teamNames: Array.from({ length: count }, (_, i) => state.teamNames[i] || `Time ${i + 1}`),
                    }));
                }
            },
            
            setTeamName: (index, newName) => {
                set((state) => {
                    const newTeamNames = [...state.teamNames];
                    newTeamNames[index] = newName;
                    return { teamNames: newTeamNames };
                });
            },

            generateTeams: () => {
                const { players, numTeams, seed } = get();
                if (players.length >= numTeams) {
                    const newTeams = generateBalancedTeams(players, numTeams, seed);
                    set({ teams: newTeams });
                }
            },

            setSeed: (seed) => set({ seed }),

            clearAll: () => set({ players: [], teams: [], seed: '', teamNames: [] }),
        }),
        {
            name: 'random-teams-storage',
            partialize: (state) => ({
                players: state.players,
                numTeams: state.numTeams,
                seed: state.seed,
            }),
        }
    )
);

