const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- CONFIGURAÇÃO DO POSTGRES -------------------- //
console.log("🔹 DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("❌ Erro: DATABASE_URL não está definida!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// -------------------- ROTAS -------------------- //

app.get("/", (req, res) => {
  res.send("API do Ateliê funcionando com Render DB!");
});

// -----------------------------------------------------------
// -------------------------- CLIENTES ------------------------
// -----------------------------------------------------------

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

app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients ORDER BY id ASC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

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

// -----------------------------------------------------------
// -------------------------- ORDERS --------------------------
// -----------------------------------------------------------

// Criar pedido
app.post("/orders", async (req, res) => {
  try {
    const { client_id, title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO orders (client_id, title, description)
       VALUES ($1, $2, $3) RETURNING *;`,
      [client_id, title, description]
    );

    res.json({ message: "Pedido criado!", order: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Listar pedidos de um cliente
app.get("/orders/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    const result = await pool.query(
      "SELECT * FROM orders WHERE client_id = $1 ORDER BY created_at DESC;",
      [clientId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Listar tarefas dentro de um pedido
app.get("/orders/:orderId/tasks", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE order_id = $1 ORDER BY delivery_date ASC;",
      [orderId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar tarefas do pedido:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// -----------------------------------------------------------
// -------------------------- TAREFAS --------------------------
// -----------------------------------------------------------

// Criar tarefa
app.post("/tasks", async (req, res) => {
  try {
    const { client_id, order_id, service, description, price, delivery_date } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (client_id, order_id, service, description, price, delivery_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [client_id, order_id, service, description, price, delivery_date]
    );

    // Atualiza o total do pedido automaticamente
    if (order_id) {
      await pool.query(
        `UPDATE orders 
         SET total = COALESCE((SELECT SUM(price) FROM tasks WHERE order_id = $1), 0)
         WHERE id = $1;`,
        [order_id]
      );
    }

    res.json({ message: "Tarefa criada com sucesso!", task: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Listar tarefas de um cliente
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

// Atualizar status de tarefa
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

    // Buscar tarefa pra atualizar o total do pedido depois
    const task = await pool.query("SELECT order_id FROM tasks WHERE id = $1", [id]);

    await pool.query("DELETE FROM tasks WHERE id = $1;", [id]);

    // Atualizar total do pedido (se pertencer a um)
    if (task.rows[0] && task.rows[0].order_id) {
      await pool.query(
        `UPDATE orders 
         SET total = COALESCE((SELECT SUM(price) FROM tasks WHERE order_id = $1), 0)
         WHERE id = $1;`,
        [task.rows[0].order_id]
      );
    }

    res.json({ message: "Tarefa deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

// -------------------- START SERVER -------------------- //

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
