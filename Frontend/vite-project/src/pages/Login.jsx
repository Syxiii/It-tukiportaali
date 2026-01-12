import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Kirjauduttu sisään käyttäjänä: ${email}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 style={{textAlign:"center"}}>Kirjautuminen</h2>
            <input
                type="email"
                placeholder="Sähköposti"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Kirjaudu</button>
        </form>
    );
}

export default Login;
