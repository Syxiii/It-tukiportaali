import { useState } from "react";
import api from "../pages/api";

export default function UserManagement({ users, setUsers }) {
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const toggleAdminStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
      )
    );
  };

  const deleteUser = (userId) => {
    if (confirm("Oletko varma että haluat poistaa käyttäjän?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const addNewUser = () => {
    if (!newUsername || !newPassword) {
      alert("Täytä kaikki kentät");
      return;
    }

    if (users.some((user) => user.username === newUsername)) {
      alert("Käyttäjä on jo olemassa");
      return;
    }

    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      username: newUsername,
      password: newPassword,
      isAdmin: false,
    };

    setUsers([...users, newUser]);
    setNewUsername("");
    setNewPassword("");
    setShowForm(false);
    alert("Käyttäjä luotu!");
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
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Salasana"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
