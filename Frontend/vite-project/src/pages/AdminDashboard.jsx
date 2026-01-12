import { useState } from "react";
import mockTickets from "../data/mockTickets";
import TicketCard from "../components/TicketCard";

function AdminDashboard() {
  const [tickets, setTickets] = useState(mockTickets);

  // Päivittää tiketin tilan valitusta dropdownista
  const changeStatus = (id, newStatus) => {
    setTickets(tickets.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  // Ryhmitellään tiketit tilan mukaan
  const ticketsAvoin = tickets.filter(t => t.status === "Avoin");
  const ticketsKasittelyssa = tickets.filter(t => t.status === "Käsittelyssä");
  const ticketsRatkaistu = tickets.filter(t => t.status === "Ratkaistu");

  return (
    <div className="container">
      <h2>IT-tuen hallintapaneeli</h2>

      <div style={{marginTop: '20px'}}>
        <h3>Avoimet tiketit</h3>
        {ticketsAvoin.length === 0 && <p>Ei avoimia tikettejä</p>}
        {ticketsAvoin.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <span>{ticket.title}</span>
            <select
              value={ticket.status}
              onChange={(e) => changeStatus(ticket.id, e.target.value)}
            >
              <option value="Avoin">Avoin</option>
              <option value="Käsittelyssä">Käsittelyssä</option>
              <option value="Ratkaistu">Ratkaistu</option>
            </select>
          </div>
        ))}
      </div>

      <div style={{marginTop: '20px'}}>
        <h3>Käsittelyssä</h3>
        {ticketsKasittelyssa.length === 0 && <p>Ei käsittelyssä olevia tikettejä</p>}
        {ticketsKasittelyssa.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <span>{ticket.title}</span>
            <select
              value={ticket.status}
              onChange={(e) => changeStatus(ticket.id, e.target.value)}
            >
              <option value="Avoin">Avoin</option>
              <option value="Käsittelyssä">Käsittelyssä</option>
              <option value="Ratkaistu">Ratkaistu</option>
            </select>
          </div>
        ))}
      </div>

      <div style={{marginTop: '20px'}}>
        <h3>Ratkaistut</h3>
        {ticketsRatkaistu.length === 0 && <p>Ei ratkaistuja tikettejä</p>}
        {ticketsRatkaistu.map(ticket => (
          <div key={ticket.id} className="ticket-card">
            <span>{ticket.title}</span>
            <select
              value={ticket.status}
              onChange={(e) => changeStatus(ticket.id, e.target.value)}
            >
              <option value="Avoin">Avoin</option>
              <option value="Käsittelyssä">Käsittelyssä</option>
              <option value="Ratkaistu">Ratkaistu</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
