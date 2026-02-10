import { useState } from "react";
import api from "../pages/api";

export default function CreateTicket({ tickets, setTickets }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("KESKITASO");
  const [submitted, setSubmitted] = useState(false);

  const submitTicket = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Täytä otsikko ja kuvaus");
      return;
    }

    try {
      
      const res = await api.post("/tickets/createtickets", {
        title,
        description,
        priority
      });

      setTitle("");
      setDescription("");
      setPriority("KESKITASO");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);

    } catch (error) {
      alert(error.response?.data?.message || "Tikettiä ei voitu luoda");
    }
  };

  return (
    <div className="container">
      <div className="create-ticket-card">
        <h2>Uusi tukipyyntö</h2>
        {submitted && <div className="success-message"> Tiketti luotu onnistuneesti!</div>}
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

          <div className="form-group">
            <label htmlFor="priority">Prioriteetti</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="KORKEA">Korkea</option>
              <option value="KESKITASO">Keskitaso</option>
              <option value="MATALA">Matala</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">Lähetä tukipyyntö</button>
        </form>
      </div>
    </div>
  );
}
