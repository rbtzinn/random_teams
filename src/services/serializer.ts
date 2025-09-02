import LZString from 'lz-string';
import { useTeamsStore } from '../store/teams.store';

// Aumentando a versão para invalidar links antigos caso a estrutura mude
const DATA_VERSION = '1.1'; 

// Define a estrutura completa do estado que queremos compartilhar
interface SharedState {
    version: string;
    players: { name: string; level: number }[];
    numTeams: number;
    teamNames: string[];
    seed: string;
}

export const stateToUrl = (): string => {
    const { players, numTeams, teamNames, seed } = useTeamsStore.getState();
    const state: SharedState = {
        version: DATA_VERSION,
        players,
        numTeams,
        teamNames,
        seed,
    };

    const jsonString = JSON.stringify(state);
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    // Usamos window.location.origin e pathname para construir a base da URL
    return `${window.location.origin}${window.location.pathname}?data=${compressed}`;
};

export const urlToState = (): void => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');

    if (data) {
        try {
            const decompressed = LZString.decompressFromEncodedURIComponent(data);
            if (!decompressed) return;

            const state: SharedState = JSON.parse(decompressed);

            // Verifica a versão para garantir compatibilidade
            if (state.version === DATA_VERSION && state.players && state.numTeams) {
                // Atualiza o store com os dados da URL
                useTeamsStore.setState({
                    players: state.players,
                    numTeams: state.numTeams,
                    teamNames: state.teamNames || [],
                    seed: state.seed || '',
                    teams: [], // Limpa os times para forçar um novo sorteio se necessário
                });
            } else {
                 console.warn('Dados do link são de uma versão incompatível ou corrompidos.');
            }
        } catch (error) {
            console.error('Falha ao processar dados do link de compartilhamento:', error);
            // Limpa o parâmetro da URL se ele for inválido para evitar recargas com erro
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
};

