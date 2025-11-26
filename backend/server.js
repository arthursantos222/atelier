const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com PostgreSQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "atelier",
  password: "senai",
  port: 5432,
});

// -------------------- ROTAS -------------------- //

// Rota teste
app.get("/", (req, res) => {
  res.send("API do Ateliê funcionando!");
});

// ---------- CLIENTES ---------- //

// Criar cliente
app.post("/clients", async (req, res) => {
  try {
    const { name, phone, notes } = req.body;
    const result = await pool.query(
      "INSERT INTO clients (name, phone, notes) VALUES ($1, $2, $3) RETURNING *;",
      [name, phone, notes]
    );
    res.json({ message: "Cliente criado com sucesso!", client: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Listar todos clientes
app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients ORDER BY id ASC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Deletar cliente
app.delete("/clients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM clients WHERE id = $1;", [id]);
    res.json({ message: "Cliente deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// ---------- TAREFAS ---------- //

// Criar tarefa
app.post("/tasks", async (req, res) => {
  try {
    const { client_id, service, description, price, delivery_date } = req.body;
    const result = await pool.query(
      `INSERT INTO tasks (client_id, service, description, price, delivery_date)
       VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [client_id, service, description, price, delivery_date]
    );
    res.json({ message: "Tarefa criada com sucesso!", task: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Listar todas tarefas de um cliente
app.get("/tasks/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const result = await pool.query(
      "SELECT * FROM tasks WHERE client_id = $1 ORDER BY delivery_date ASC;",
      [clientId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Atualizar status da tarefa
app.patch("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *;",
      [status, id]
    );
    res.json({ message: "Status atualizado!", task: result.rows[0] });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Deletar tarefa
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tasks WHERE id = $1;", [id]);
    res.json({ message: "Tarefa deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// -------------------- START SERVER -------------------- //
app.listen(3001, () => {
  console.log("🚀 Servidor rodando na porta 3001");
});
