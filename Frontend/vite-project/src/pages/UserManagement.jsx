import { useState } from "react";
import api from "../pages/api";

import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [])

    const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/getusers");
      setUsers(res.data);
    } catch {
      alert("Käyttäjien haku epäonnistui");
    }
  };

  // tee myöhemmin const toggleAdminStatus = async (user) =>

  const deleteUser = async (id) => {

      try {
      await api.delete(`auth/deleteusers/${id}`);
      fetchUsers();
    } catch {
      alert("Käyttäjän poisto epäonnistui");
    }
  };

  const addNewUser = async () => {
    if (!name || !email || !password) {
      alert("Täytä kaikki kentät");
      return;
    }

    try {
      await api.post("auth/register", { name, email, password });

      setName("");
      setEmail("");
      setPassword("");
      setShowForm(false);
      fetchUsers();
      alert("Käyttäjä luotu!");

    } catch (error) {
      alert(error.response?.data?.message || "Käyttäjän luonti epäonnistui");
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
            value={newUsername}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Sähköposti"
            value={newEmail}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
          
            type="password"
            placeholder="Salasana"
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={addNewUser}>Luo käyttäjä</button>
        </div>
      )}

      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-item">
            <div className="user-info">
              <span className="username">{user.username}</span>
              <span className={`role-badge ${user.isAdmin ? "admin" : "user"}`}>
                {user.isAdmin ? "Admin" : "Käyttäjä"}
              </span>
            </div>
            <div className="user-actions">
              <button
                className={`admin-toggle ${user.isAdmin ? "remove" : "add"}`}
                onClick={() => toggleAdminStatus(user.id)}
              >
                {user.isAdmin ? "Poista admin" : "Tee admin"}
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
