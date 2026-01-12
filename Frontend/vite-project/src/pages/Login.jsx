import { useState } from "react";
import initialUsers from "../data/users";

export default function Login({ onLogin, users, setUsers }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = () => {
    if (!name || !password) {
      alert("Täytä kaikki kentät");
      return;
    }

    const user = users.find((u) => u.username === name && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      alert("Väärä käyttäjätunnus tai salasana");
    }
  };

  const handleRegister = () => {
    if (!name || !password || !confirmPassword) {
      alert("Täytä kaikki kentät");
      return;
    }

    if (password !== confirmPassword) {
      alert("Salasanat eivät täsmää");
      return;
    }

    if (users.some((u) => u.username === name)) {
      alert("Käyttäjä on jo olemassa");
      return;
    }

    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      username: name,
      password: password,
      isAdmin: false,
    };

    setUsers([...users, newUser]);
    alert("Käyttäjä luotu! Kirjaudu sisään.");
    setName("");
    setPassword("");
    setConfirmPassword("");
    setIsLoginMode(true);
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
              placeholder="Käyttäjätunnus"
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
            <button onClick={handleLogin}>Kirjaudu</button>
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
              placeholder="Käyttäjätunnus"
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
            <button onClick={handleRegister}>Luo käyttäjä</button>
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

        <hr style={{ margin: "20px 0" }} />
        <p>
          <strong>Demokäyttäjät:</strong>
        </p>
        <p>rasmus / 1234</p>
        <p>it / admin (Admin)</p>
      </div>
    </div>
  );
}
