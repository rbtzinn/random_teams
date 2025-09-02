export interface Player {
    name: string;
    level: number;
}

// Função para criar um gerador de números pseudoaleatórios (PRNG) a partir de uma semente
function createPRNG(seed: string) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    }

    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

function shuffleArray<T>(array: T[], seed: string): T[] {
    const rng = createPRNG(seed);
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = rng() % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export const parsePlayerList = (text: string): Player[] => {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(name => name.length > 0)
        .map(name => ({ name, level: 3 }));
};

// CORREÇÃO: Lógica de 'locks' removida
export const generateBalancedTeams = (players: Player[], numTeams: number, seed: string): Player[][] => {
    const playersToShuffle = [...players];

    // Se uma semente for fornecida, embaralhamos os jogadores de forma determinística
    // Se não, o embaralhamento será aleatório
    const shuffledPlayers = seed ? shuffleArray(playersToShuffle, seed) : playersToShuffle.sort(() => 0.5 - Math.random());

    const teams: Player[][] = Array.from({ length: numTeams }, () => []);
    const teamLevelSums: number[] = Array.from({ length: numTeams }, () => 0);

    // Ordena por nível para distribuir os melhores primeiro
    shuffledPlayers.sort((a, b) => b.level - a.level);

    shuffledPlayers.forEach(player => {
        const minLevelSumIndex = teamLevelSums.indexOf(Math.min(...teamLevelSums));
        teams[minLevelSumIndex].push(player);
        teamLevelSums[minLevelSumIndex] += player.level;
    });

    teams.forEach(team => {
        // Embaralha dentro do time para não ficarem ordenados por nível
        if (seed) {
            // Usa uma semente derivada para o embaralhamento interno
            shuffleArray(team, seed + team.map(p => p.name).join());
        } else {
            team.sort(() => 0.5 - Math.random());
        }
    });

    return teams;
};

export const formatTeamsForClipboard = (teams: Player[][], teamNames: string[]): string => {
    let formattedString = '';

    teams.forEach((team, index) => {
        const teamName = teamNames[index] || `Time ${index + 1}`;
        const averageLevel = team.reduce((sum, p) => sum + p.level, 0) / (team.length || 1);
        formattedString += `--- ${teamName} (Média: ${averageLevel.toFixed(1)}) ---\n`;
        
        team.forEach(player => {
            formattedString += `- ${player.name} (Nível ${player.level})\n`;
        });
        formattedString += '\n';
    });

    return formattedString.trim();
};

