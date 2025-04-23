import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPadrao from '../ButtonPadrao';
import InputPadrao from '../InputPadrao';
import './CriarTorneio.scss';

interface Team {
    name: string;
    players: string[];
}

interface Match {
    team1: string;
    team2: string;
    winner?: string;
}

const CriarTorneio = () => {
    const navigate = useNavigate();
    const [tournamentName, setTournamentName] = useState('');
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeam, setCurrentTeam] = useState('');
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentRound, setCurrentRound] = useState(0);
    const [tournamentStarted, setTournamentStarted] = useState(false);

    const handleAddTeam = () => {
        if (currentTeam.trim() && teams.length < 8) { 
            setTeams([...teams, { name: currentTeam.trim(), players: [] }]);
            setCurrentTeam('');
        }
    };

    const handleRemoveTeam = (index: number) => {
        const newTeams = [...teams];
        newTeams.splice(index, 1);
        setTeams(newTeams);
    };

    const startTournament = () => {
        if (teams.length >= 2 && tournamentName.trim()) {
            const shuffledTeams = [...teams].sort(() => 0.5 - Math.random());
            const initialMatches: Match[] = [];

            for (let i = 0; i < shuffledTeams.length; i += 2) {
                if (shuffledTeams[i + 1]) {
                    initialMatches.push({
                        team1: shuffledTeams[i].name,
                        team2: shuffledTeams[i + 1].name
                    });
                } else {
                    initialMatches.push({
                        team1: shuffledTeams[i].name,
                        team2: 'BYE',
                        winner: shuffledTeams[i].name
                    });
                }
            }

            setMatches(initialMatches);
            setTournamentStarted(true);
            setCurrentRound(1);
        }
    };

    const setWinner = (matchIndex: number, winner: string) => {
        const updatedMatches = [...matches];
        updatedMatches[matchIndex].winner = winner;
        setMatches(updatedMatches);
    };

    const advanceRound = () => {
        const winners = matches
            .filter(match => match.winner)
            .map(match => match.winner) as string[];

        if (winners.length >= 2) {
            const newMatches: Match[] = [];

            for (let i = 0; i < winners.length; i += 2) {
                if (winners[i + 1]) {
                    newMatches.push({
                        team1: winners[i],
                        team2: winners[i + 1]
                    });
                } else {
                    newMatches.push({
                        team1: winners[i],
                        team2: 'BYE',
                        winner: winners[i]
                    });
                }
            }

            setMatches(newMatches);
            setCurrentRound(currentRound + 1);
        }
    };

    const finishTournament = () => {
        if (matches.length === 1 && matches[0].winner) {
            alert(`Torneio "${tournamentName}" finalizado! Campeão: ${matches[0].winner}`);
            navigate('/');
        }
    };

    return (
        <div className="tournament-creator">
            <div className="tournament-card">
                {!tournamentStarted ? (
                    <>
                        <h1 className="tournament-title">Criar Torneio</h1>
                        <p className="tournament-subtitle">Organize um torneio entre times pré-definidos</p>

                        <InputPadrao
                            placeholder="Nome do Torneio"
                            value={tournamentName}
                            onChange={(e) => setTournamentName(e.target.value)}
                        />

                        <h5 className="section-title">Times Participantes</h5>
                        <div className="team-input-container">
                            <InputPadrao
                                placeholder="Nome do Time"
                                value={currentTeam}
                                onChange={(e) => setCurrentTeam(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
                            />
                            <ButtonPadrao
                                texto="Adicionar Time"
                                onClick={handleAddTeam}
                                disabled={!currentTeam.trim() || teams.length >= 8}
                            />
                        </div>

                        <div className="teams-list">
                            {teams.map((team, index) => (
                                <div key={index} className="team-item">
                                    <span>{team.name}</span>
                                    <button
                                        onClick={() => handleRemoveTeam(index)}
                                        className="remove-btn"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <ButtonPadrao
                            texto="Iniciar Torneio"
                            onClick={startTournament}
                            disabled={teams.length < 2 || !tournamentName.trim()}
                            className="mt-4"
                        />
                    </>
                ) : (
                    <>
                        <h1 className="tournament-title">{tournamentName}</h1>
                        <h3 className="round-title">Rodada {currentRound}</h3>

                        <div className="matches-container">
                            {matches.map((match, index) => (
                                <div key={index} className="match-card">
                                    {match.winner ? (
                                        <div className="match-result">
                                            <span className={match.winner === match.team1 ? 'winner' : ''}>
                                                {match.team1}
                                            </span>
                                            {match.team2 !== 'BYE' && (
                                                <span className={match.winner === match.team2 ? 'winner' : ''}>
                                                    {match.team2}
                                                </span>
                                            )}
                                            {match.team2 === 'BYE' && <span className="bye">BYE</span>}
                                        </div>
                                    ) : (
                                        <div className="match-teams">
                                            <button onClick={() => setWinner(index, match.team1)}>
                                                {match.team1}
                                            </button>
                                            <span>vs</span>
                                            {match.team2 !== 'BYE' ? (
                                                <button onClick={() => setWinner(index, match.team2)}>
                                                    {match.team2}
                                                </button>
                                            ) : (
                                                <span className="bye">BYE</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {matches.every(match => match.winner) && (
                            <div className="actions">
                                {matches.length > 1 ? (
                                    <ButtonPadrao
                                        texto="Próxima Rodada"
                                        onClick={advanceRound}
                                    />
                                ) : (
                                    <ButtonPadrao
                                        texto="Finalizar Torneio"
                                        onClick={finishTournament}
                                        variant="primario"
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CriarTorneio;