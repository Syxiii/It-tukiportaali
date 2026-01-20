import TicketCard from "../components/TicketCard";
import api from "../pages/api";

export default function AdminDashboard({ tickets, setTickets }) {
  const changeStatus = (id, newStatus) => {
    setTickets(
      tickets.map(t => t.id === id ? { ...t, status: newStatus } : t)
    );
  };

  const stats = {
    Avoin: tickets.filter(t => t.status === "Avoin").length,
    "Käsittelyssä": tickets.filter(t => t.status === "Käsittelyssä").length,
    Ratkaistu: tickets.filter(t => t.status === "Ratkaistu").length,
  };

  return (
    <div>
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

      {tickets.map(ticket => (
        <div key={ticket.id} className="ticket-card">
          <h4>{ticket.title}</h4>
          <p>{ticket.description}</p>
          <p>Tilanne: {ticket.status}</p>
          <p>Käyttäjä: {ticket.user}</p>
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
          </div>
        </div>
      ))}
    </div>
  );
}
