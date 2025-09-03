import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  updateProfile,
  signOut,
  User,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore"; // Importe o getDoc
import { auth, googleProvider, db } from "../../firebase/config";
import { useAuth, AppUser } from "../../context/AuthContext"; // Importe useAuth e AppUser
import ButtonPadrao from "../../components/ButtonPadrao";
import InputPadrao from "../../components/InputPadrao";
import "./styles.scss";
import { FaGoogle } from "react-icons/fa";

// Função auxiliar para pegar os nomes (pode ser movida para um arquivo de utilitários)
const getFirstAndSecondName = (fullName: string | null): string => {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");
  return names.slice(0, 2).join(" ");
};

const LoginPage: React.FC = () => {
  const { setUser } = useAuth(); // Obtenha a função setUser do contexto
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [unverifiedUser, setUnverifiedUser] = useState<User | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [resendCooldown]);

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccessMessage("");

  if (password.length < 6) {
    setError("A senha deve ter no mínimo 6 caracteres.");
    return;
  }
  if (password !== confirmPassword) {
    setError("As senhas não coincidem.");
    return;
  }

  try {
    // 1. Cria o usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // 2. Atualiza o profile (displayName)
    try {
      await updateProfile(firebaseUser, { displayName: name });
    } catch {
      console.warn("⚠️ Falha ao atualizar o nome de exibição");
    }

    // 3. Salva no Firestore
    try {
      await setDoc(doc(db, "users", firebaseUser.uid), {
        displayName: name,
        email: firebaseUser.email,
      });
    } catch {
      console.warn("⚠️ Falha ao salvar no Firestore");
    }

    // 4. Envia email de verificação
    try {
      await firebaseUser.reload();
      await sendEmailVerification(firebaseUser);
      setSuccessMessage(
        `Registro realizado! Um e-mail de verificação foi enviado para ${firebaseUser.email}. 
         Verifique sua caixa de entrada ou a pasta de spam.`
      );
    } catch {
      setError("Conta criada, mas não foi possível enviar o e-mail de verificação.");
    }

    // 5. Limpa os campos do formulário
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  } catch (err: any) {
    setError(
      err.code === "auth/email-already-in-use"
        ? "Este e-mail já está em uso."
        : "Ocorreu um erro ao registrar. Tente novamente."
    );
  }
};


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setUnverifiedUser(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const loggedUser = userCredential.user;

      await loggedUser.reload();

      if (loggedUser.emailVerified) {
        // Lógica para buscar o nome de exibição do Firestore
        const userDocRef = doc(db, "users", loggedUser.uid);
        const userDoc = await getDoc(userDocRef);
        let fullName = loggedUser.displayName;
        if (userDoc.exists()) {
          fullName = userDoc.data().displayName || fullName;
        }

        // Crie o objeto AppUser
        const appUser: AppUser = {
          firebaseUser: loggedUser,
          displayName: getFirstAndSecondName(fullName),
        };

        // ATUALIZE O ESTADO GLOBAL IMEDIATAMENTE
        setUser(appUser);
      } else {
        setUnverifiedUser(loggedUser);
        setError("Por favor, verifique seu e-mail para continuar.");
        await signOut(auth);
      }
    } catch (err: any) {
      setError("E-mail ou senha inválidos.");
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser || resendCooldown > 0) return;

    try {
      await sendEmailVerification(unverifiedUser);
      setSuccessMessage(
        "E-mail de verificação reenviado! Lembre-se de checar sua caixa de spam ou lixo eletrônico."
      );
      setError("");
      setResendCooldown(60);
    } catch (error) {
      setError(
        "Ocorreu um erro ao reenviar o e-mail. Tente novamente mais tarde."
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      // O onAuthStateChanged cuidará do redirecionamento
    } catch (err) {
      setError("Ocorreu um erro ao fazer login com o Google.");
    }
  };

  return (
    <div className="login-page-container">
      <div
        className={`login-card ${activeTab === "register" ? "is-flipped" : ""}`}
      >
        <div className="login-card-inner">
          <div className="card-face card-front">
            <div className="tab-buttons">
              <button className="tab-btn active">Entrar</button>
              <button
                className="tab-btn"
                onClick={() => setActiveTab("register")}
              >
                Registrar
              </button>
            </div>
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
              <ButtonPadrao texto="Entrar" type="submit" className="w-100" />
            </form>
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
            />
          </div>
          <div className="card-face card-back">
            <div className="tab-buttons">
              <button className="tab-btn" onClick={() => setActiveTab("login")}>
                Entrar
              </button>
              <button className="tab-btn active">Registrar</button>
            </div>
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
              />
            </form>
          </div>
        </div>
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
