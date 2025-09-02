import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, generateBalancedTeams, parsePlayerList } from '../services/team.services';

interface TeamsState {
    players: Player[];
    numTeams: number;
    teamNames: string[];
    teams: Player[][];
    seed: string; // Novo estado para a semente
    loadPlayersFromText: (text: string) => void;
    updatePlayerLevel: (playerIndex: number, newLevel: number) => void;
    removePlayer: (index: number) => void;
    clearPlayers: () => void;
    setNumTeams: (count: number) => void;
    setTeamName: (index: number, newName: string) => void;
    setSeed: (seed: string) => void; // Nova ação
    generateTeams: () => void;
}

export const useTeamsStore = create(
    persist<TeamsState>(
        (set, get) => ({
            players: [],
            numTeams: 2,
            teamNames: ['Time 1', 'Time 2'],
            teams: [],
            seed: '', // Valor inicial

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

            removePlayer: (playerIndex: number) => {
                set(state => ({
                    players: state.players.filter((_, index) => index !== playerIndex),
                    teams: [],
                }));
            },
            
            clearPlayers: () => {
                set({ players: [], teams: [] });
            },

            setNumTeams: (count) => {
                if (count >= 2) {
                    set((state) => ({
                        numTeams: count,
                        teamNames: Array.from({ length: count }, (_, i) => state.teamNames[i] || `Time ${i + 1}`),
                        teams: [],
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
            
            setSeed: (seed) => {
                set({ seed });
            },

            generateTeams: () => {
                const { players, numTeams, seed } = get();
                if (players.length >= numTeams) {
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
                seed: state.seed, // Salva a semente no localStorage também
            }),
        }
    )
);

