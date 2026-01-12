function TicketCard({ ticket }) {
    const statusClass = ticket.status === "Avoin" ? "badge-avoim"
                      : ticket.status === "Käsittelyssä" ? "badge-kasittelyssa"
                      : "badge-ratkaistu";

    return (
        <div className="ticket-card">
            <span>{ticket.title}</span>
            <span className={`badge ${statusClass}`}>{ticket.status}</span>
        </div>
    );
}

export default TicketCard;
