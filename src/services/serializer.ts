import LZString from 'lz-string';
import { useTeamsStore } from '../store/teams.store';

// Define um tipo para o estado que será salvo, para segurança
type ShareableState = Pick<
    ReturnType<typeof useTeamsStore.getState>,
    'players' | 'numTeams' | 'teamNames' | 'teams' | 'seed'
>;

/**
 * Pega o estado atual da aplicação e o converte em uma URL compartilhável.
 * @returns A URL completa com o estado comprimido.
 */
export const stateToUrl = (): string => {
    const currentState = useTeamsStore.getState();

    // Seleciona apenas os campos que queremos compartilhar
    const stateToShare: ShareableState = {
        players: currentState.players,
        numTeams: currentState.numTeams,
        teamNames: currentState.teamNames,
        teams: currentState.teams,
        seed: currentState.seed,
    };

    const jsonState = JSON.stringify(stateToShare);
    const compressedState = LZString.compressToEncodedURIComponent(jsonState);
    
    // Retorna a URL completa
    return `${window.location.origin}${window.location.pathname}?state=${compressedState}`;
};

/**
 * Lê o estado da URL, o descomprime e o retorna.
 * @returns O objeto de estado ou null se não houver estado na URL.
 */
export const urlToState = (): ShareableState | null => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateFromUrl = urlParams.get('state');

    if (stateFromUrl) {
        try {
            const decompressedState = LZString.decompressFromEncodedURIComponent(stateFromUrl);
            if (decompressedState) {
                const parsedState: ShareableState = JSON.parse(decompressedState);
                return parsedState;
            }
        } catch (error) {
            console.error("Erro ao processar o estado da URL:", error);
            return null; // Retorna null em caso de erro
        }
    }
    
    return null; // Retorna null se não houver estado na URL
};

