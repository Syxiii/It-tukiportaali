import { useEffect, useState } from "react";
import api from "../pages/api";

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tickets on mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("tickets/gettickets");
        setTickets(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Tikettien haku epäonnistui");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Update ticket status via backend
  const changeStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`tickets/update/${id}`, { status: newStatus });
      setTickets(tickets.map(t => t.id === id ? res.data : t));
    } catch (error) {
      alert(error.response?.data?.message || "Statusin päivitys epäonnistui");
    }
  };

  // Delete ticket via backend
  const deleteTicket = async (id) => {
    if (!confirm("Oletko varma että haluat poistaa tiketin?")) return;

    try {
      await api.delete(`/tickets/delete/${id}`);
      setTickets(tickets.filter(t => t.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Tikettiä ei voitu poistaa");
    }
  };

  if (loading) return <div>Ladataan tikettejä...</div>;

  // Calculate stats
  const stats = {
    Avoin: tickets.filter(t => t.status === "Avoin").length,
    "Käsittelyssä": tickets.filter(t => t.status === "Käsittelyssä").length,
    Ratkaistu: tickets.filter(t => t.status === "Ratkaistu").length,
  };

  return (
    <div className="container">
      <h2>IT-tuen hallintapaneeli</h2>

      <div className="stats">
        <div className="card open">
          <h3>Avoimet</h3>
          <p>{stats.Avoin}</p>
        </div>
        <div className="card working">
          <h3>Käsittelyssä</h3>
          <p>{stats["Käsittelyssä"]}</p>
        </div>
        <div className="card done">
          <h3>Ratkaistut</h3>
          <p>{stats.Ratkaistu}</p>
        </div>
      </div>

      <div className="tickets-list">
        {tickets.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <h4>{ticket.title}</h4>
            <p>{ticket.description}</p>
            <p>Tilanne: {ticket.status}</p>
            <p>
              Käyttäjä: {ticket.user.name} ({ticket.user.email})
            </p>

            <div className="status-buttons">
              {["Avoin", "Käsittelyssä", "Ratkaistu"].map(status => (
                <button
                  key={status}
                  onClick={() => changeStatus(ticket.id, status)}
                  disabled={ticket.status === status}
                >
                  {status}
                </button>
              ))}
              <button
                className="delete-btn"
                onClick={() => deleteTicket(ticket.id)}
              >
                Poista
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

