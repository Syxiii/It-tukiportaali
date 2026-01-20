import { useState } from "react";
import api from "../pages/api";

export default function CreateTicket({ tickets, setTickets, user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitTicket = (e) => {
    e.preventDefault();
    const newTicket = {
      id: tickets.length + 1,
      title,
      description,
      status: "Avoin",
      user,
    };
    setTickets([...tickets, newTicket]);
    setTitle("");
    setDescription("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="container">
      <div className="create-ticket-card">
        <h2>Uusi tukipyyntö</h2>
        {submitted && <div className="success-message">✓ Tiketti luotu onnistuneesti!</div>}
        <form onSubmit={submitTicket}>
          <div className="form-group">
            <label htmlFor="title">Otsikko *</label>
            <input
              id="title"
              type="text"
              placeholder="Kirjoita tiketin otsikko"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Kuvaus *</label>
            <textarea
              id="description"
              placeholder="Kirjoita yksityiskohtainen kuvaus ongelmastasi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
              className="form-textarea"
            />
          </div>
          <button type="submit" className="submit-btn">Lähetä tukipyyntö</button>
        </form>
      </div>
    </div>
  );
}
