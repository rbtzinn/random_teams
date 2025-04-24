import React, { useState } from 'react';
import InputPadrao from '../InputPadrao';
import ButtonPadrao from '../ButtonPadrao';
import TextoPadrao from '../TextoPadrao';
import './criador.scss';

interface Player {
  name: string;
  level: number;
}

const CriadorDeTimes: React.FC = () => {
    const [playerName, setPlayerName] = useState('');
    const [playerLevel, setPlayerLevel] = useState(1);
    const [players, setPlayers] = useState<Player[]>([]);
    const [numTeams, setNumTeams] = useState(2);
    const [teamNames, setTeamNames] = useState<string[]>(['Time 1', 'Time 2']);
    const [teams, setTeams] = useState<Player[][]>([]);

    const handleAddPlayer = () => {
        if (playerName.trim()) {
            setPlayers([...players, { name: playerName.trim(), level: playerLevel }]);
            setPlayerName('');
            setPlayerLevel(1);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddPlayer();
        }
    };

    const handleTeamNameChange = (index: number, newName: string) => {
        const updated = [...teamNames];
        updated[index] = newName;
        setTeamNames(updated);
    };

    const shuffleAndDivideTeams = () => {
        // Ordena os jogadores por nível (do maior para o menor)
        const sortedByLevel = [...players].sort((a, b) => b.level - a.level);
        const newTeams: Player[][] = Array.from({ length: numTeams }, () => []);
        
        // Distribui os jogadores balanceadamente
        sortedByLevel.forEach((player, index) => {
            // Alterna entre os times para distribuir os jogadores de alto nível
            const teamIndex = index % numTeams;
            newTeams[teamIndex].push(player);
        });
        
        // Embaralha os jogadores dentro de cada time para não ficar na ordem de nível
        newTeams.forEach(team => {
            team.sort(() => 0.5 - Math.random());
        });

        setTeams(newTeams);
    };

    const removePlayer = (index: number) => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
        setTeams([]);
    };

    return (
        <div className="team-creator-container">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="team-creator-card p-4 shadow-sm rounded">
                            <TextoPadrao texto="Criador de Times" as="h2" className="text-center mb-4" />
                            <div className="add-player-section mb-4">
                                <div className="input-group mb-2">
                                    <InputPadrao
                                        placeholder="Nome do jogador"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="form-control-lg"
                                    />
                                </div>
                                <div className="d-block align-items-center gap-3 mb-3">
                                    <label htmlFor="playerLevel" className="form-label mb-0">Nível do jogador:</label>
                                    <select 
                                        id="playerLevel"
                                        className="form-select"
                                        value={playerLevel}
                                        onChange={(e) => setPlayerLevel(Number(e.target.value))}
                                    >
                                        {[1, 2, 3, 4, 5].map(level => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>
                                <ButtonPadrao
                                    texto="Adicionar"
                                    onClick={handleAddPlayer}
                                    className="btn-primary btn-lg"
                                />
                            </div>

                            <div className="num-teams-control mb-4 d-flex align-items-center gap-3 justify-content-center">
                                <ButtonPadrao
                                    texto="−"
                                    onClick={() => {
                                        if (numTeams > 2) {
                                            setNumTeams(numTeams - 1);
                                            setTeamNames(Array.from({ length: numTeams - 1 }, (_, i) => `Time ${i + 1}`));
                                            setTeams([]);
                                        }
                                    }}
                                    size="sm"
                                    variant="outline-primario"
                                    hoverScale={false}
                                />
                                <span className="fw-bold fs-5">{numTeams} {numTeams === 1 ? 'time' : 'times'}</span>
                                <ButtonPadrao
                                    texto="+"
                                    onClick={() => {
                                        if (numTeams < players.length) {
                                            setNumTeams(numTeams + 1);
                                            setTeamNames(Array.from({ length: numTeams + 1 }, (_, i) => `Time ${i + 1}`));
                                            setTeams([]);
                                        }
                                    }}
                                    size="sm"
                                    variant="outline-primario"
                                    hoverScale={false}
                                />
                            </div>

                            <div className="d-grid mb-4">
                                <ButtonPadrao
                                    texto="Sortear Times"
                                    onClick={shuffleAndDivideTeams}
                                    disabled={players.length < numTeams}
                                    className="btn-primary btn-lg"
                                />
                            </div>

                            {players.length > 0 && (
                                <div className="players-section mb-4">
                                    <TextoPadrao texto="Jogadores Adicionados" as="h5" className="mb-3" />
                                    <div className="players-list">
                                        {players.map((player, index) => (
                                            <div key={index} className="player-badge">
                                                <span>
                                                    {player.name} (Nível {player.level})
                                                </span>
                                                <button
                                                    onClick={() => removePlayer(index)}
                                                    className="btn-close btn-close-white"
                                                    aria-label="Remover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="players-count mt-2">
                                        Total: {players.length} jogador{players.length !== 1 ? 'es' : ''}
                                    </div>
                                </div>
                            )}

                            {teams.length > 0 && (
                                <div className="teams-section">
                                    <TextoPadrao texto="Times Sorteados" as="h5" className="mb-3 text-center" />
                                    <div className="row g-4">
                                        {teams.map((team, index) => {
                                            const averageLevel = team.reduce((sum, player) => sum + player.level, 0) / team.length;
                                            
                                            return (
                                                <div key={index} className="col-md-6">
                                                    <div className={`team-card team-${index + 1}`}>
                                                        <div className="d-flex align-items-center gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                value={teamNames[index]}
                                                                onChange={(e) => handleTeamNameChange(index, e.target.value)}
                                                                className="form-control team-header"
                                                            />
                                                            <span className="badge bg-secondary">
                                                                Média: {averageLevel.toFixed(1)}
                                                            </span>
                                                        </div>
                                                        <ul className="team-members">
                                                            {team.map((p, idx) => (
                                                                <li key={idx} className="team-member">
                                                                    <span className="member-number">{idx + 1}.</span> 
                                                                    {p.name} <span className="text-muted">(Nível {p.level})</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriadorDeTimes;