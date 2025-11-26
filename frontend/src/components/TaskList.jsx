import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://atelier-backend-1-h1ba.onrender.com";

export default function TaskList({ clientId, refreshTrigger }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!clientId) return;
    axios.get(`${API_URL}/tasks/client/${clientId}`)
      .then(res => setTasks(res.data));
  }, [clientId, refreshTrigger]);

  const updateStatus = async (taskId, status) => {
    const res = await axios.patch(`${API_URL}/tasks/${taskId}`, { status });
    setTasks(tasks.map(t => t.id === taskId ? res.data.task : t));
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`${API_URL}/tasks/${taskId}`);
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {tasks.map(task => (
        <li key={task.id} style={taskStyle}>
          <div>
            <strong>{task.service}</strong> 
            {task.description && <p style={{ margin: "5px 0", color: "#555" }}>{task.description}</p>}
            <p style={{ margin: "5px 0", color: "#555" }}>
              Preço: {task.price ? Number(task.price).toFixed(2) : "0.00"} | Entrega: {task.delivery_date || "N/A"}
            </p>
            <p>Status: <span style={{ fontWeight: "600", color: task.status === "concluída" ? "#27ae60" : "#e1b12c" }}>{task.status}</span></p>
          </div>
          <div>
            {task.status !== "concluída" && (
              <button onClick={() => updateStatus(task.id, "concluída")} style={concludeButton}>Concluir</button>
            )}
            <button onClick={() => deleteTask(task.id)} style={deleteButton}>Deletar</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

const taskStyle = {
  padding: "15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  borderBottom: "1px solid #eee",
  borderRadius: "8px",
  marginBottom: "10px",
  backgroundColor: "#fff",
};

const deleteButton = {
  backgroundColor: "#c0392b",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  marginLeft: "5px"
};

const concludeButton = {
  backgroundColor: "#27ae60",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
  marginRight: "5px"
};
