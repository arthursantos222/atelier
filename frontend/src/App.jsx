import { useState } from "react";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [tasksUpdated, setTasksUpdated] = useState(false);
  const [clientsUpdated, setClientsUpdated] = useState(false);

  return (
    <div style={fullScreenContainer}>
      <div style={dashboardContainer}>
        <header style={headerStyle}>
          <h1>Studio Ana Sanches</h1>
          <p>Gerencie clientes e tarefas do ateliê de forma prática</p>
        </header>

        <div style={sectionsContainer}>
          <section style={cardStyle}>
            <h2 style={sectionTitle}>Adicionar Cliente</h2>
            <ClientForm onClientAdded={() => setClientsUpdated(!clientsUpdated)} />
          </section>

          <section style={cardStyle}>
            <h2 style={sectionTitle}>Clientes</h2>
            <ClientList
              onSelectClient={setSelectedClient}
              refreshTrigger={clientsUpdated}
            />
          </section>

          <section style={cardStyle}>
            {selectedClient ? (
              <>
                <h2 style={sectionTitle}>Tarefas de {selectedClient.name}</h2>
                <TaskForm
                  clientId={selectedClient.id}
                  onTaskAdded={() => setTasksUpdated(!tasksUpdated)}
                />
                <TaskList
                  clientId={selectedClient.id}
                  refreshTrigger={tasksUpdated}
                />
              </>
            ) : (
              <div style={emptyState}>
                <p>Selecione um cliente para ver e adicionar tarefas.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// === ESTILOS ===

const fullScreenContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100vw",
  backgroundColor: "#f0f2f5",
  padding: "20px",
  fontFamily: "Arial, sans-serif",
};

const dashboardContainer = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "900px",
  gap: "30px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "30px",
  color: "#2c3e50",
};

const sectionsContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const cardStyle = {
  backgroundColor: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  minHeight: "250px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const sectionTitle = {
  color: "#2c3e50",
  marginBottom: "15px",
  fontSize: "18px",
  fontWeight: "600",
};

const emptyState = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "150px",
  color: "#7f8c8d",
  fontStyle: "italic",
  textAlign: "center",
};
