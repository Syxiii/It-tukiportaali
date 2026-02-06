import { useEffect, useState } from "react";
import TicketCard from "../components/TicketCard";
import api from "../pages/api";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

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

  const loadComments = async (ticketId) => {
    setCommentsLoading(true);
    try {
      const res = await api.get(`/tickets/${ticketId}/getcomment`);
      setComments(res.data || []);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Kommenttien haku epäonnistui";
      alert(msg);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    loadComments(ticket.id);
  };

  const handleCloseDetails = () => {
    setSelectedTicket(null);
    setComments([]);
    setCommentText("");
  };

  const handleAddComment = async () => {
    if (!selectedTicket || !commentText.trim()) return;

    setPostingComment(true);
    try {
      await api.post(`/tickets/${selectedTicket.id}/createcomment`, {
        content: commentText.trim(),
      });
      setCommentText("");
      await loadComments(selectedTicket.id);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Kommentin lisääminen epäonnistui";
      alert(msg);
    } finally {
      setPostingComment(false);
    }
  };

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
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => handleSelectTicket(ticket)}
            />
          ))}
        </div>
      )}

      {selectedTicket && (
        <div className="ticket-detail-overlay" onClick={handleCloseDetails}>
          <div
            className="ticket-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ticket-detail-header">
              <h3>{selectedTicket.title}</h3>
              <button className="modal-close-button" onClick={handleCloseDetails}>
                X
              </button>
            </div>

            <p className="ticket-detail-meta">
              Tila: {selectedTicket.status} • Prioriteetti: {selectedTicket.priority || "-"}
            </p>
            <p className="ticket-detail-description">{selectedTicket.description}</p>

            <div className="comments-section">
              <h4>Kommentit</h4>
              {commentsLoading ? (
                <p>Ladataan kommentteja...</p>
              ) : comments.length === 0 ? (
                <p>Ei kommentteja vielä.</p>
              ) : (
                <ul className="comment-list">
                  {comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <strong>{comment.user?.name || "Käyttäjä"}</strong>
                        <span className="comment-date">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                        </span>
                      </div>
                      <p>{comment.content}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="comment-form">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Lisää kommentti..."
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={postingComment || !commentText.trim()}
                >
                  {postingComment ? "Tallennetaan..." : "Lisää kommentti"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
