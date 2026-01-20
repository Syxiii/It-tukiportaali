import { useEffect, useState } from "react";
import TicketCard from "../components/TicketCard";
import api from "../pages/api";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch my tickets on component mount
  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const res = await api.get("/tickets/my"); 
        setTickets(res.data);
      } catch (error) {
        alert(error.response?.data?.message || "Tikettien haku epäonnistui");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (loading) {
    return <div className="container">Ladataan tikettejä...</div>;
  }

  return (
    <div className="container">
      <h2>Omat tiketit</h2>
      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>Sinulla ei ole vielä luotuja tikettejä</p>
          <small>Luo uusi tukipyyntö napsauttamalla "Tee tiketti" -painiketta</small>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
