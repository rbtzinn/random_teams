export interface Player {
    name: string;
    level: number;
}

/**
 * Cria uma função de geração de números pseudoaleatórios (PRNG) a partir de uma semente.
 * Usa o algoritmo xmur3 para hashear a semente e sfc32 para a geração.
 * Isso garante que a mesma semente sempre produzirá a mesma sequência de números.
 */
function createSeededRandom(seed: string): () => number {
    let a = 0x9e3779b9, b = 0x243f6a88, c = 0xb7e15162, d = 0;
    for (let i = 0; i < seed.length; i++) {
        a ^= seed.charCodeAt(i) << (i % 24);
        b += a; c += b; d += c;
        a = (a << 3) | (a >>> 29);
        b = (b << 3) | (b >>> 29);
        c = (c << 3) | (c >>> 29);
        d = (d << 3) | (d >>> 29);
    }
    return function() {
        a |= 0; b |= 0; c |= 0; d |= 0;
        const t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = ((c << 21) | (c >>> 11)) + d | 0;
        d = (d + 1) | 0;
        return (t >>> 0) / 4294967296;
    };
}

/**
 * Embaralha um array usando um gerador de números aleatórios (sementeado ou não).
 */
function shuffleArray<T>(array: T[], rng: () => number = Math.random): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export const parsePlayerList = (text: string): Player[] => {
    return text
        .split('\n')
        .map(line => line.trim())
        .filter(name => name.length > 0)
        .filter((name, index, self) => self.indexOf(name) === index)
        .map(name => ({ name, level: 3 }));
};

export const generateBalancedTeams = (players: Player[], numTeams: number, seed?: string): Player[][] => {
    const rng = seed ? createSeededRandom(seed) : Math.random;

    const sortedPlayers = [...players].sort((a, b) => b.level - a.level);
    const shuffledPlayers = shuffleArray(sortedPlayers, rng); // Embaralha antes para mais variedade

    const teams: Player[][] = Array.from({ length: numTeams }, () => []);
    const teamLevelSums: number[] = Array.from({ length: numTeams }, () => 0);

    shuffledPlayers.forEach(player => {
        const minLevelSumIndex = teamLevelSums.indexOf(Math.min(...teamLevelSums));
        teams[minLevelSumIndex].push(player);
        teamLevelSums[minLevelSumIndex] += player.level;
    });

    teams.forEach(team => team.sort((a, b) => a.name.localeCompare(b.name)));

    return teams;
};

export const formatTeamsForClipboard = (teams: Player[][], teamNames: string[]): string => {
    let formattedString = '';
    teams.forEach((team, index) => {
        const teamName = teamNames[index] || `Time ${index + 1}`;
        const averageLevel = team.reduce((sum, p) => sum + p.level, 0) / team.length || 0;
        formattedString += `${teamName} (Média: ${averageLevel.toFixed(1)})\n`;
        team.forEach(player => {
            formattedString += `- ${player.name} (Nível ${player.level})\n`;
        });
        formattedString += '\n';
    });
    return formattedString.trim();
};

