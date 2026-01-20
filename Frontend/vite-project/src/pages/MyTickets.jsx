import TicketCard from "../components/TicketCard";
import api from "../pages/api";

function MyTickets({ tickets, currentUser }) {
  const myTickets = tickets.filter(t => t.user === currentUser);

  return (
    <div className="container">
      <h2>Omat tiketit</h2>
      {myTickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Sinulla ei ole vielä luotuja tikettejä</p>
          <small>Luo uusi tukipyyntö napsauttamalla "Tee tiketti" -painiketta</small>
        </div>
      ) : (
        <div className="tickets-list">
          {myTickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTickets;
