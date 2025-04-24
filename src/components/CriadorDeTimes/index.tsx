import React, { useState } from 'react';
import InputPadrao from '../InputPadrao';
import ButtonPadrao from '../ButtonPadrao';
import TextoPadrao from '../TextoPadrao';
import './criador.scss';

const CriadorDeTimes: React.FC = () => {
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState<string[]>([]);
    const [numTeams, setNumTeams] = useState(2);
    const [teamNames, setTeamNames] = useState<string[]>(['Time 1', 'Time 2']);
    const [teams, setTeams] = useState<string[][]>([]);

    const handleAddPlayer = () => {
        if (playerName.trim()) {
            setPlayers([...players, playerName.trim()]);
            setPlayerName('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddPlayer();
        }
    };

    const handleNumTeamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > 1 && value <= players.length) {
            setNumTeams(value);
            setTeamNames(Array.from({ length: value }, (_, i) => `Time ${i + 1}`));
            setTeams([]);
        }
    };

    const handleTeamNameChange = (index: number, newName: string) => {
        const updated = [...teamNames];
        updated[index] = newName;
        setTeamNames(updated);
    };

    const shuffleAndDivideTeams = () => {
        const shuffled = [...players].sort(() => 0.5 - Math.random());
        const newTeams: string[][] = Array.from({ length: numTeams }, () => []);

        shuffled.forEach((player, index) => {
            newTeams[index % numTeams].push(player);
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
                                <div className="input-group">
                                    <InputPadrao
                                        placeholder="Nome do jogador"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="form-control-lg"
                                    />
                                </div>
                                <ButtonPadrao
                                    texto="Adicionar"
                                    onClick={handleAddPlayer}
                                    className="btn-primary btn-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="numTeams" className="form-label">Número de times:</label>
                                <input
                                    id="numTeams"
                                    type="number"
                                    min={2}
                                    max={players.length || 2}
                                    value={numTeams}
                                    onChange={handleNumTeamsChange}
                                    className="form-control"
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
                                                <span>{player}</span>
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
                                        {teams.map((team, index) => (
                                            <div key={index} className="col-md-6">
                                                <div className={`team-card team-${index + 1}`}>
                                                    <input
                                                        type="text"
                                                        value={teamNames[index]}
                                                        onChange={(e) => handleTeamNameChange(index, e.target.value)}
                                                        className="form-control team-header mb-2"
                                                    />
                                                    <ul className="team-members">
                                                        {team.map((p, idx) => (
                                                            <li key={idx} className="team-member">
                                                                <span className="member-number">{idx + 1}.</span> {p}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
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
