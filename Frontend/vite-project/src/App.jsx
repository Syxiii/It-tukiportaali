import { useState, useEffect } from "react";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import Welcome from "./pages/Welcome";
import UserManagement from "./pages/UserManagement";
import mockTickets from "./data/mockTickets";
import initialUsers from "./data/users";
import api from "./pages/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("welcome");
  const [tickets, setTickets] = useState(mockTickets);
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    if (currentUser && currentUser.username === "rasmus") {
      setPage("welcome");
    } else if (currentUser && currentUser.isAdmin) {
      setPage("dashboard");
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} users={users} setUsers={setUsers} />;
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">IT Support</div>
        <div className="user-header">
          <p className="user">{currentUser.username}</p>
          {currentUser.isAdmin && <span className="admin-badge">Admin</span>}
        </div>
        <nav>
          <button onClick={() => setPage("welcome")}>Etusivu</button>
          {currentUser.isAdmin && <button onClick={() => setPage("dashboard")}>Dashboard</button>}
          {currentUser.isAdmin && <button onClick={() => setPage("users")}>Käyttäjät</button>}
          <button onClick={() => setPage("new")}>Tee tiketti</button>
          <button onClick={() => setPage("my")}>Omat tiketit</button>
          <button onClick={() => setPage("faq")}>FAQ</button>
          <button className="logout" onClick={() => setCurrentUser(null)}>Kirjaudu ulos</button>
        </nav>
      </div>

      <div className="content">
        {page === "welcome" && <Welcome currentUser={currentUser.username} />}
        {page === "dashboard" && currentUser.isAdmin && (
          <AdminDashboard tickets={tickets} setTickets={setTickets} />
        )}
        {page === "users" && currentUser.isAdmin && (
          <UserManagement users={users} setUsers={setUsers} />
        )}
        {page === "new" && (
          <CreateTicket tickets={tickets} setTickets={setTickets} user={currentUser.username} />
        )}
        {page === "my" && (
          <MyTickets tickets={tickets} currentUser={currentUser.username} />
        )}
        {page === "faq" && <FAQ />}
      </div>
    </div>
  );
}
