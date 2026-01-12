import { useState } from "react";
import mockTickets from "../data/mockTickets";

function AdminDashboard() {
    const [tickets, setTickets] = useState(mockTickets);

    const updateStatus = (id) => {
        setTickets(tickets.map(t =>
            t.id === id ? { ...t, status: "Ratkaistu" } : t
        ));
    };

    return (
        <div className="container">
            <h2>IT-tuen hallintapaneeli</h2>
            {tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                    <span>{ticket.title} – {ticket.status}</span>
                    <button onClick={() => updateStatus(ticket.id)}>Merkitse ratkaistuksi</button>
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;
