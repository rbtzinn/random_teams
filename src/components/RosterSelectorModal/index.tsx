import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.tsx";
import { useUIStore } from "../../store/ui.store.ts";
import { Player } from "../../services/team.services.ts";
import { fetchRoster } from "../../firebase/rosterService.ts";
import ButtonPadrao from "../ButtonPadrao/index.tsx";
import "./styles.scss";
import { useTeamsStore } from "../../store/teams.store.ts";
import LevelSelector from "../LevelSelector/index.tsx";

const RosterSelectorModal: React.FC = () => {
  const { user } = useAuth();
  const { isRosterSelectorModalOpen, closeRosterSelectorModal } = useUIStore();
  const { addPlayersToSession } = useTeamsStore();

  const [roster, setRoster] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRoster = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError("");
    try {
      const userRoster = await fetchRoster(user.firebaseUser.uid);
      setRoster(userRoster);
    } catch (err) {
      setError("Não foi possível carregar o elenco.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isRosterSelectorModalOpen) {
      loadRoster();
    }
  }, [isRosterSelectorModalOpen, loadRoster]);

  const handlePlayerToggle = (playerId: string) => {
    const newSelection = new Set(selectedPlayers);
    if (newSelection.has(playerId)) {
      newSelection.delete(playerId);
    } else {
      newSelection.add(playerId);
    }
    setSelectedPlayers(newSelection);
  };

  const handleAddSelectedPlayers = () => {
    const playersToAdd = roster.filter((player) =>
      selectedPlayers.has(player.id)
    );
    addPlayersToSession(playersToAdd);
    closeRosterSelectorModal();
    setSelectedPlayers(new Set());
  };

  if (!isRosterSelectorModalOpen) {
    return null;
  }

  return (
    <div className="roster-selector-overlay" onClick={closeRosterSelectorModal}>
      <div
        className="roster-selector-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Carregar do Elenco</h3>
          <button onClick={closeRosterSelectorModal} className="close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          {isLoading && <p>Carregando elenco...</p>}
          {error && <p className="error-message">{error}</p>}
          {!isLoading && roster.length === 0 && (
            <div className="empty-state">
              <p>Seu elenco está vazio.</p>
              <p>Adicione jogadores em "Meu Elenco" na barra de navegação.</p>
            </div>
          )}

          {!isLoading && roster.length > 0 && (
            <div className="player-selection-list">
              {roster.map((player) => (
                <div
                  key={player.id}
                  className="player-item"
                  onClick={() => handlePlayerToggle(player.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlayers.has(player.id)}
                    readOnly
                  />
                  <span className="player-name">{player.name}</span>
                  <div className="player-level">
                    <span>Nível {player.level}</span>
                    <LevelSelector level={player.level} onChange={() => {}} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <ButtonPadrao
            texto={
              <>
                <FaUserPlus /> Adicionar Selecionados ({selectedPlayers.size})
              </>
            }
            onClick={handleAddSelectedPlayers}
            disabled={selectedPlayers.size === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default RosterSelectorModal;
