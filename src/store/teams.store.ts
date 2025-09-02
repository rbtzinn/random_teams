import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, generateBalancedTeams, parsePlayerList } from '../services/team.services';

// Define a estrutura para os locks
interface PlayerLocks {
    [playerName: string]: number; // ex: { 'João': 0, 'Maria': 1 }
}

// ATUALIZAÇÃO: Adiciona as novas propriedades ao "contrato"
export interface TeamsState {
    players: Player[];
    numTeams: number;
    teamNames: string[];
    teams: Player[][];
    seed: string;
    locks: PlayerLocks; // Adicionado
    loadPlayersFromText: (text: string) => void;
    updatePlayerLevel: (playerIndex: number, newLevel: number) => void;
    clearPlayers: () => void;
    removePlayer: (index: number) => void;
    setNumTeams: (count: number) => void;
    setTeamName: (index: number, newName: string) => void;
    generateTeams: () => void;
    setSeed: (seed: string) => void;
    togglePlayerLock: (playerName: string, teamIndex: number) => void; // Adicionado
}

export const useTeamsStore = create(
    persist<TeamsState>(
        (set, get) => ({
            players: [],
            numTeams: 2,
            teamNames: ['Time 1', 'Time 2'],
            teams: [],
            seed: '',
            locks: {}, // Estado inicial

            loadPlayersFromText: (text) => {
                const newPlayers = parsePlayerList(text);
                set({ players: newPlayers, teams: [], locks: {} });
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
                set({ players: [], teams: [], seed: '', locks: {} });
            },

            removePlayer: (index) => {
                set((state) => {
                    const newPlayers = [...state.players];
                    newPlayers.splice(index, 1);
                    return { players: newPlayers, teams: [], locks: {} };
                });
            },

            setNumTeams: (count) => {
                if (count >= 2) {
                    set({
                        numTeams: count,
                        teamNames: Array.from({ length: count }, (_, i) => `Time ${i + 1}`),
                        teams: [],
                        locks: {}
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
            
            togglePlayerLock: (playerName, teamIndex) => {
                set((state) => {
                    const newLocks = { ...state.locks };
                    if (newLocks[playerName] === teamIndex) {
                        delete newLocks[playerName]; // Destrava se já estiver travado no mesmo time
                    } else {
                        newLocks[playerName] = teamIndex; // Trava no novo time
                    }
                    return { locks: newLocks };
                });
            },

            generateTeams: () => {
                const { players, numTeams, seed, locks } = get();
                if (players.length >= numTeams) {
                    const newTeams = generateBalancedTeams(players, numTeams, seed, locks);
                    set({ teams: newTeams });
                }
            },
        }),
        {
            name: 'random-teams-storage',
            // ATUALIZAÇÃO: Garante que o objeto retornado seja parcial de TeamsState
            partialize: (state) => ({
                players: state.players,
                numTeams: state.numTeams,
                seed: state.seed,
                // Não persistimos os locks para evitar inconsistências
            }),
        }
    )
);

