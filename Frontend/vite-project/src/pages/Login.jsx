import { useState } from "react";
import api from "../pages/api";

export default function Login({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Täytä kaikki kentät");
      return;
    }

    try {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    const {token, user} = response.data;
    onLogin(token, user);


  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || "Kirjautuminen epäonnistui");
    } else {
      alert("Palvelin ei vastaa");
    }
  }

  setEmail("");
  setPassword("");

};

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword) {
      alert("Täytä kaikki kentät");
      return;
    }

    if (password !== confirmPassword) {
      alert("Salasanat eivät täsmää");
      return;
    }
    
    try {
    const response = await api.post("/auth/register", {
      email,
      name,
      password
    });

    alert("Käyttäjä luotu! Kirjaudu sisään.");

    setName("");
    setEmail("")
    setPassword("");
    setConfirmPassword("");
    setIsLoginMode(false);

  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || "Kirjautuminen epäonnistui");
    } else {
      alert("Palvelin ei vastaa");
    }
  }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isLoginMode) {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };


  return (
    <div className="login-page">
      <div className="login-box">
        <h1>IT Support Portal</h1>

        {isLoginMode ? (
          <>
            <h2>Kirjaudu sisään</h2>
            <input
              placeholder="Sähköposti"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="password"
              placeholder="Salasana"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="primary-button" onClick={handleLogin}>
              Kirjaudu
            </button>
            <p>
              Ei ole vielä käyttäjää?{" "}
              <button
                className="link-button"
                onClick={() => setIsLoginMode(false)}
              >
                Luo uusi käyttäjä
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Luo uusi käyttäjä</h2>
            <input
              placeholder="Sähköposti"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              placeholder="Nimi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="password"
              placeholder="Salasana"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input
              type="password"
              placeholder="Vahvista salasana"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="primary-button" onClick={handleRegister}>
              Luo käyttäjä
            </button>
            <p>
              Sinulla on jo käyttäjä?{" "}
              <button
                className="link-button"
                onClick={() => setIsLoginMode(true)}
              >
                Kirjaudu sisään
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
