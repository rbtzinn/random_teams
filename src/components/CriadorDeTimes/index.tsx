import React, { useState } from 'react';
import InputPadrao from '../InputPadrao';
import ButtonPadrao from '../ButtonPadrao';
import TextoPadrao from '../TextoPadrao';
import './criador.scss';

const CriadorDeTimes: React.FC = () => {
    const [playerName, setPlayerName] = useState('');
    const [players, setPlayers] = useState<string[]>([]);
    const [teams, setTeams] = useState<{ team1: string[]; team2: string[] }>({ team1: [], team2: [] });

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

    const shuffleAndDivideTeams = () => {
        const shuffled = [...players].sort(() => 0.5 - Math.random());
        const half = Math.ceil(shuffled.length / 2);
        setTeams({
            team1: shuffled.slice(0, half),
            team2: shuffled.slice(half),
        });
    };

    const removePlayer = (index: number) => {
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
        setTeams({ team1: [], team2: [] });
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPlayerName(e.target.value)}
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

                            <div className="d-grid mb-4">
                                <ButtonPadrao
                                    texto="Sortear Times"
                                    onClick={shuffleAndDivideTeams}
                                    disabled={players.length < 2}
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

                            {teams.team1.length > 0 && teams.team2.length > 0 && (
                                <div className="teams-section">
                                    <TextoPadrao texto="Times Sorteados" as="h5" className="mb-3 text-center" />
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="team-card team-1">
                                                <TextoPadrao texto={`Time 1 (${teams.team1.length})`} as="h4" className="team-header" />
                                                <ul className="team-members">
                                                    {teams.team1.map((p, idx) => (
                                                        <li key={idx} className="team-member">
                                                            <span className="member-number">{idx + 1}.</span> {p}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="team-card team-2">
                                                <TextoPadrao texto={`Time 2 (${teams.team2.length})`} as="h4" className="team-header" />
                                                <ul className="team-members">
                                                    {teams.team2.map((p, idx) => (
                                                        <li key={idx} className="team-member">
                                                            <span className="member-number">{idx + 1}.</span> {p}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
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