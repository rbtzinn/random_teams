import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, generateBalancedTeams, parsePlayerList } from '../services/team.services';

export interface TeamsState {
    players: Player[];
    numTeams: number;
    teamNames: string[];
    teams: Player[][];
    seed: string;
    loadPlayersFromText: (text: string) => void;
    updatePlayerLevel: (playerIndex: number, newLevel: number) => void;
    clearPlayers: () => void;
    removePlayer: (index: number) => void;
    setNumTeams: (count: number) => void;
    setTeamName: (index: number, newName: string) => void;
    generateTeams: () => void;
    setSeed: (seed: string) => void;
}

// Usando a sintaxe recomendada do Zustand v4 para middleware
export const useTeamsStore = create<TeamsState>()(
    persist(
        (set, get) => ({
            players: [],
            numTeams: 2,
            teamNames: ['Time 1', 'Time 2'],
            teams: [],
            seed: '',

            loadPlayersFromText: (text) => {
                const newPlayers = parsePlayerList(text);
                set({ players: newPlayers, teams: [] });
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
            
            clearPlayers: () => {
                set({ players: [], teams: [], seed: '' });
            },

            removePlayer: (index) => {
                set((state) => {
                    const newPlayers = [...state.players];
                    newPlayers.splice(index, 1);
                    return { players: newPlayers, teams: [] };
                });
            },

            setNumTeams: (count) => {
                if (count >= 2) {
                    set({
                        numTeams: count,
                        teamNames: Array.from({ length: count }, (_, i) => `Time ${i + 1}`),
                        teams: [],
                    });
                }
            },
            
            setTeamName: (index, newName) => {
                set((state) => {
                    const newTeamNames = [...state.teamNames];
                    newTeamNames[index] = newName;
                    return { teamNames: newTeamNames };
                });
            },

            setSeed: (seed) => {
                set({ seed });
            },

            generateTeams: () => {
                const { players, numTeams, seed } = get();
                if (players.length >= numTeams) {
                    // CORREÇÃO: Chamada da função sem o 'locks'
                    const newTeams = generateBalancedTeams(players, numTeams, seed);
                    set({ teams: newTeams });
                }
            },
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

