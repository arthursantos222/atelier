import { useEffect, useState } from "react";
import axios from "axios";

export default function ClientList({ onSelectClient, refreshTrigger }) {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/clients").then(res => setClients(res.data));
  }, [refreshTrigger]);

  const deleteClient = async (id) => {
    await axios.delete(`http://localhost:3001/clients/${id}`);
    setClients(clients.filter(c => c.id !== id));
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {clients.map(client => (
        <li key={client.id} style={liStyle}>
          <span onClick={() => onSelectClient(client)} style={clientNameStyle}>
            {client.name} ({client.phone})
          </span>
          <button onClick={() => deleteClient(client.id)} style={deleteButton}>Deletar</button>
        </li>
      ))}
    </ul>
  );
}

const liStyle = {
  padding: "12px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #eee",
  borderRadius: "8px",
  marginBottom: "10px",
  backgroundColor: "#fafafa",
  transition: "background-color 0.2s",
};

const clientNameStyle = {
  cursor: "pointer",
  fontWeight: "500",
};

const deleteButton = {
  backgroundColor: "#c0392b",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600"
};
