import { useState } from "react";

function CreateTicket() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const submitTicket = (e) => {
        e.preventDefault();
        alert("Tiketti luotu (mock)");
        setTitle("");
        setDescription("");
    };

    return (
        <form onSubmit={submitTicket}>
            <h2 style={{textAlign:"center"}}>Uusi tukipyyntö</h2>
            <input
                placeholder="Otsikko"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Kuvaus"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
            />
            <button type="submit">Lähetä</button>
        </form>
    );
}

export default CreateTicket;
