import React from 'react';
// Caminho ajustado para ser mais compatível com o bundler
import ButtonPadrao from '../ButtonPadrao';
import './CorpoDaHome.scss';
import { ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CorpoDaHome: React.FC = () => {
    return (
        <div className="corpo-home-container">
            <section className="hero-section">
                <div className="container">
                    <h1 className="hero-title">Crie Times Perfeitos</h1>
                    <p className="hero-subtitle">
                        Gerencie seus jogadores e forme equipes balanceadas para qualquer esporte
                    </p>
                    <div className="hero-actions">
                        <Link to="/criar-times">
                            <ButtonPadrao
                                texto="Criar Times"
                                variant="primario"
                                className="me-3"
                                hoverScale={1.05}
                            />
                        </Link>
                        <Link to="/criar-torneio">
                            <ButtonPadrao
                                texto="Criar Torneio"
                                variant="primario"
                                className="me-3"
                                hoverScale={1.05}
                            />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="features-section py-5">
                <div className="container">
                    <h2 className="section-title text-center mb-5">Recursos Principais</h2>

                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">🎯</div>
                                <h3>Balanceamento Automático</h3>
                                <p>Algoritmo inteligente para criar times equilibrados</p>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">🔄</div>
                                <h3>Multiplas Modalidades</h3>
                                <p>Funciona para futebol, vôlei, basquete e mais</p>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="feature-card">
                                <div className="feature-icon">📊</div>
                                <h3>Estatísticas</h3>
                                <p>Acompanhe o histórico de seus jogadores</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* A classe bg-light foi removida daqui */}
            <section className="cta-section py-5">
                <div className="container text-center">
                    <h2 className="mb-4">Pronto para começar?</h2>
                    <p className="lead mb-4">Crie seu primeiro time em menos de 1 minuto</p>
                    <ButtonPadrao
                        texto={<ChevronUp size={32} />}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        aria-label="Voltar ao topo"
                        variant="primario"
                        size="lg"
                        className="scroll-top-btn"
                        hoverScale={1.1}
                    />
                </div>
            </section>

        </div>
    );
};

