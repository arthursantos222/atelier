import { useState } from "react";
import axios from "axios";

export default function ClientForm({ onClientAdded }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3001/clients", { name, phone, notes });
    setName(""); setPhone(""); setNotes("");
    onClientAdded();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} required style={inputStyle}/>
      <input placeholder="Telefone" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle}/>
      <input placeholder="Notas" value={notes} onChange={e => setNotes(e.target.value)} style={inputStyle}/>
      <button type="submit" style={buttonStyle}>Adicionar Cliente</button>
    </form>
  );
}

const formStyle = { display: "flex", flexDirection: "column", gap: "12px" };
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #bdc3c7",
  fontSize: "15px",
  outline: "none",
  transition: "all 0.2s",
};
const buttonStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2980b9",
  color: "#fff",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
  transition: "background-color 0.2s",
};
