import { useState } from "react";
import axios from "axios";

const API_URL = "https://atelier-backend-1-h1ba.onrender.com";

export default function TaskForm({ clientId, onTaskAdded }) {
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/tasks`, {
      client_id: clientId,
      service,
      description,
      price: parseFloat(price),
      delivery_date: deliveryDate
    });
    setService(""); setDescription(""); setPrice(""); setDeliveryDate("");
    onTaskAdded();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
      <input placeholder="Serviço" value={service} onChange={e => setService(e.target.value)} style={inputStyle} required/>
      <input placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle}/>
      <input placeholder="Preço" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle}/>
      <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} style={inputStyle}/>
      <button type="submit" style={buttonStyle}>Adicionar Tarefa</button>
    </form>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #bdc3c7",
  fontSize: "14px",
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
  fontWeight: "600",
  transition: "background-color 0.2s",
};
