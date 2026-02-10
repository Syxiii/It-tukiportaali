import { useState, useEffect } from "react";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import Welcome from "./pages/Welcome";
import UserManagement from "./pages/UserManagement";

export default function App() {
  
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  const [page, setPage] = useState("welcome");


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setToken(storedToken);

        // Default page based on role
        if (parsedUser.role === "ADMIN") setPage("dashboard");
        else setPage("welcome");
      } catch {
        
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  
  const handleLogin = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setCurrentUser(user);

    if (user.role === "ADMIN") setPage("dashboard");
    else setPage("welcome");
  };

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setCurrentUser(null);
    setPage("welcome");
  };

  
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">IT Support</div>
        <div className="user-header">
          <p className="user">{currentUser.name}</p>
          {currentUser.role === "ADMIN" && <span className="admin-badge">Admin</span>}
        </div>

        <nav>
          <button onClick={() => setPage("welcome")}>Etusivu</button>
          {currentUser.role === "ADMIN" && (
            <>
              <button onClick={() => setPage("dashboard")}>Dashboard</button>
              <button onClick={() => setPage("users")}>Käyttäjät</button>
            </>
          )}
          <button onClick={() => setPage("new")}>Tee tiketti</button>
          <button onClick={() => setPage("my")}>Omat tiketit</button>
          <button onClick={() => setPage("faq")}>FAQ</button>
          <button className="logout" onClick={handleLogout}>
            Kirjaudu ulos
          </button>
        </nav>
      </div>

      <div className="content">
        {page === "welcome" && <Welcome currentUser={currentUser.name} />}
        {page === "dashboard" && currentUser.role === "ADMIN" && (
          <AdminDashboard token={token} />
        )}
        {page === "users" && currentUser.role === "ADMIN" && (
          <UserManagement token={token} />
        )}
        {page === "new" && (
          <CreateTicket token={token} user={currentUser.name} />
        )}
        {page === "my" && (
          <MyTickets token={token} currentUser={currentUser.name} />
        )}
        {page === "faq" && <FAQ />}
      </div>
    </div>
  );
}
