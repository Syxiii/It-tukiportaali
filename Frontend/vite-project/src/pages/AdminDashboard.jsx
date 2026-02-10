import { useState, useEffect } from "react";
import api from "../pages/api";

export default function AdminDashboard({ token }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const STATUS = {
  AVOIN: "AVOIN",
  KASITTELYSSA: "KASITTELYSSA",
  RATKAISTU: "RATKAISTU"
};

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/tickets/gettickets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Tikettien haku epäonnistui");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  const changeStatus = async (id, newStatus) => {
    try {
      const res = await api.put(
        `/tickets/update/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Statusin päivitys epäonnistui");
    }
  };

  const deleteTicket = async (id) => {
    if (!confirm("Oletko varma että haluat poistaa tiketin?")) return;

    try {
      await api.delete(`/tickets/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Tikettiä ei voitu poistaa");
    }
  };

  if (loading) return <div>Ladataan tikettejä...</div>;

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

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Oletko varma että haluat poistaa kommentin?")) return;

    try {
      await api.delete(`/tickets/${selectedTicket.id}/deletecomment/${commentId}`);
      await loadComments(selectedTicket.id);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.error || "Kommentin poisto epäonnistui";
      alert(msg);
    }
  };

  const stats = {
    Avoin: tickets.filter((t) => t.status === STATUS.AVOIN).length,
    "Käsittelyssä": tickets.filter((t) => t.status === STATUS.KASITTELYSSA).length,
    Ratkaistu: tickets.filter((t) => t.status === STATUS.RATKAISTU).length
  };

  const statusActions = [
    { label: "Avoin", classKey: "avoin" },
    { label: "Käsittelyssä", classKey: "kasittelyssa" },
    { label: "Ratkaistu", classKey: "ratkaistu" }
  ];


  return (
    <div className="container">
      <h2>Hallintapaneeli</h2>

      <div className="stats">
        {Object.entries(stats).map(([status, count]) => (
          <div key={status} className={`card ${status.toLowerCase()}`}>
            <h3>{status}</h3>
            <p>{count}</p>
          </div>
        ))}
      </div>

      <div className="tickets-list">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket-card ticket-card-clickable"
            role="button"
            tabIndex={0}
            onClick={() => handleSelectTicket(ticket)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectTicket(ticket);
              }
            }}
          >
            <h4>{ticket.title}</h4>
            <p>{ticket.description}</p>
            <p>Tilanne: {ticket.status}</p>
            <p>
              Käyttäjä: {ticket.user.name} ({ticket.user.email})
            </p>

            <div className="status-buttons">
              {statusActions.map((status) => (
                <button
                  key={status.label}
                  className={`status-button status-button-${status.classKey}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeStatus(ticket.id, status.label);
                  }}
                  disabled={ticket.status === status.label}
                >
                  {status.label}
                </button>
              ))}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTicket(ticket.id);
                }}
              >
                Poista
              </button>
            </div>
          </div>
        ))}
      </div>

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
                      <button
                        className="delete-comment-btn"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Poista
                      </button>
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
