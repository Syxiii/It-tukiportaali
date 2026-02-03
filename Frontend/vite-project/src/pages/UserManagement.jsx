import { useState, useEffect } from "react";
import api from "../pages/api";

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/getusers");
        setUsers(res.data);
      } catch {
        alert("Käyttäjien haku epäonnistui");
      }
    };
    fetchUsers();
  }, [token]);

  const addNewUser = async () => {
    if (!name || !email || !password) {
      alert("Täytä kaikki kentät");
      return;
    }

    try {
      await api.post(
        "/auth/register",
        { name, email, password }
      );
      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      // refresh users
      const res = await api.get("/auth/getusers");
      setUsers(res.data);
      alert("Käyttäjä luotu!");
    } catch (err) {
      alert(err.response?.data?.message || "Käyttäjän luonti epäonnistui");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Oletko varma että haluat poistaa käyttäjän?")) return;
    try {
      await api.delete(`/auth/deleteuser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      alert("Käyttäjän poisto epäonnistui");
    }
  };

  const toggleAdminStatus = async (id) => {
    try {
      await api.put(`/auth/toggleadmin/${id}`, {userId: id}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // refresh users
      const res = await api.get("/auth/getusers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      alert("Admin-oikeuksien muuttaminen epäonnistui frontendissä");
    }
  };

  return (
    <div className="user-management">
      <h2>Käyttäjien hallinta</h2>

      <button className="add-user-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Peruuta" : "+ Lisää käyttäjä"}
      </button>

      {showForm && (
        <div className="user-form">
          <h3>Uusi käyttäjä</h3>
          <input
            placeholder="Käyttäjätunnus"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Sähköposti"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Salasana"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={addNewUser}>Luo käyttäjä</button>
        </div>
      )}

      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <span className="username">{user.name}</span>
              <span className={`role-badge ${user.role === "ADMIN" ? "admin" : "user"}`}>
                {user.role === "ADMIN" ? "Admin" : "Käyttäjä"}
              </span>
            </div>
            <div className="user-actions">
              <button
                className={`admin-toggle ${user.role === "ADMIN" ? "remove" : "add"}`}
                onClick={() => toggleAdminStatus(user.id)}
              >
                {user.role === "ADMIN" ? "Poista admin" : "Tee admin"}
              </button>
              <button className="delete-btn" onClick={() => deleteUser(user.id)}>
                Poista
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
