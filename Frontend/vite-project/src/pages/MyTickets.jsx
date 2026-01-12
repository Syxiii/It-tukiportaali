import mockTickets from "../data/mockTickets";
import TicketCard from "../components/TicketCard";

function MyTickets() {
    return (
        <div className="container">
            <h2>Omat tiketit</h2>
            {mockTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
            ))}
        </div>
    );
}

export default MyTickets;
