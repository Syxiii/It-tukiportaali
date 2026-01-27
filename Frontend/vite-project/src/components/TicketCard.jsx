function TicketCard({ ticket, isAdmin = false, onStatusChange, onClick }) {
  const statusClass = ticket.status === "Avoin" ? "badge-avoin"
                    : ticket.status === "Käsittelyssä" ? "badge-kasittelyssa"
                    : "badge-ratkaistu";

  const statusIcon = ticket.status === "Avoin" ? "🔴"
                   : ticket.status === "Käsittelyssä" ? "🟡"
                   : "🟢";

  return (
    <div
      className={`ticket-card ${onClick ? "ticket-card-clickable" : ""}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="ticket-header">
        <div className="ticket-title-section">
          <h3>{ticket.title}</h3>
          <p className="ticket-user">Lähettäjä: {ticket.user}</p>
        </div>
        <span className={`badge ${statusClass}`}>
          <span className="status-icon">{statusIcon}</span>
          {ticket.status}
        </span>
      </div>
      
      <div className="ticket-description">
        <p>{ticket.description}</p>
      </div>
      
      {isAdmin && (
        <div className="ticket-admin-actions">
          <label htmlFor={`status-${ticket.id}`}>Muuta tilaa:</label>
          <select
            id={`status-${ticket.id}`}
            className="status-select"
            value={ticket.status}
            onChange={(e) => onStatusChange(ticket.id, e.target.value)}
          >
            <option value="Avoin">🔴 Avoin</option>
            <option value="Käsittelyssä">🟡 Käsittelyssä</option>
            <option value="Ratkaistu">🟢 Ratkaistu</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default TicketCard;
