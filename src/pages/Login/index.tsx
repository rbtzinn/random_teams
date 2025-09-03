import React from "react";
import ButtonPadrao from "../../components/ButtonPadrao";
import InputPadrao from "../../components/InputPadrao";
import "./styles.scss";
import { FaGoogle } from "react-icons/fa";
import { useAuthForm } from "../../hooks/useAuthForm";

const LoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    resendCooldown,
    unverifiedUser,
    resetEmail,
    setResetEmail,
    isResetting,
    setIsResetting,
    isLoading,
    activeTab,
    setActiveTab,
    handleRegister,
    handleLogin,
    handleResendVerification,
    handleGoogleSignIn,
    handlePasswordReset,
  } = useAuthForm();

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Entrar
          </button>
          <button
            className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Registrar
          </button>
        </div>

        {activeTab === "login" && (
          <div className="form-content">
            {isResetting ? (
              <form onSubmit={handlePasswordReset} className="form-container">
                <p className="form-message">
                  Insira seu e-mail para redefinir a senha.
                </p>
                <InputPadrao
                  label="Email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
                <ButtonPadrao
                  texto="Redefinir Senha"
                  type="submit"
                  className="w-100"
                  isLoading={isLoading}
                  disabled={isLoading}
                />
                <ButtonPadrao
                  texto="Voltar ao Login"
                  onClick={() => setIsResetting(false)}
                  variant="outline-primario"
                  className="w-100"
                />
              </form>
            ) : (
              <>
                <form onSubmit={handleLogin} className="form-container">
                  <InputPadrao
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <InputPadrao
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <ButtonPadrao
                    texto="Entrar"
                    type="submit"
                    className="w-100"
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                </form>
                <div className="forgot-password">
                  <button
                    className="forgot-password-btn"
                    onClick={() => {
                      setIsResetting(true);
                      setError("");
                      setSuccessMessage("");
                    }}
                  >
                    Esqueci minha senha?
                  </button>
                </div>
                <div className="divider">ou</div>
                <ButtonPadrao
                  texto={
                    <>
                      <FaGoogle /> <span>Entrar com Google</span>
                    </>
                  }
                  onClick={handleGoogleSignIn}
                  variant="outline-primario"
                  className="w-100 google-btn"
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              </>
            )}
          </div>
        )}

        {activeTab === "register" && (
          <div className="form-content">
            <form onSubmit={handleRegister} className="form-container">
              <InputPadrao
                label="Nome Completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <InputPadrao
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputPadrao
                label="Senha (mínimo 6 caracteres)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputPadrao
                label="Confirmar Senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <ButtonPadrao
                texto="Criar Conta"
                type="submit"
                className="w-100"
                isLoading={isLoading}
                disabled={isLoading}
              />
            </form>
          </div>
        )}
      </div>

      <div className="message-container">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            {unverifiedUser && (
              <ButtonPadrao
                texto={
                  resendCooldown > 0
                    ? `Aguarde ${resendCooldown}s`
                    : "Reenviar e-mail"
                }
                onClick={handleResendVerification}
                disabled={resendCooldown > 0}
                variant="secundario"
                className="mt-2"
              />
            )}
          </div>
        )}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
