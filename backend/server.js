import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- CONEXÃO COM POSTGRES RENDER ---------------- //

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ---------------- ROTAS ---------------- //

// HOME (opcional)
app.get("/", (req, res) => {
  res.send("API do Ateliê funcionando!");
});

// ---------- CLIENTS (CLIENTES) ---------- //

app.post("/clients", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const result = await pool.query(
      `INSERT INTO clients (name, email, phone)
       VALUES ($1, $2, $3) RETURNING *;`,
      [name, email, phone]
    );

    res.json({
      message: "Cliente criado com sucesso!",
      client: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ error: "Erro interno ao criar cliente" });
  }
});

app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clients ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ error: "Erro interno ao listar clientes" });
  }
});


// ---------- ORDERS (PEDIDOS) ---------- //

app.post("/orders", async (req, res) => {
  try {
    const { client_id, title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO orders (client_id, title, description)
       VALUES ($1, $2, $3) RETURNING *;`,
      [client_id, title, description]
    );

    res.json({
      message: "Pedido criado com sucesso!",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro interno ao criar pedido" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT orders.*, clients.name AS client_name
       FROM orders
       LEFT JOIN clients ON clients.id = orders.client_id
       ORDER BY orders.id DESC;`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ error: "Erro interno ao listar pedidos" });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ error: "Erro interno ao buscar pedido" });
  }
});

// ---------- RODA O SERVIDOR ---------- //

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
