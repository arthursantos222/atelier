// ---------- ORDERS (PEDIDOS) ---------- //

app.post("/orders", async (req, res) => {
  try {
    const { client_id, title, description } = req.body;

    const result = await pool.query(
      `INSERT INTO orders (client_id, title, description)
       VALUES ($1, $2, $3) RETURNING *;`,
      [client_id, title, description]
    );

    res.json({ message: "Pedido criado com sucesso!", order: result.rows[0] });
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

    const result = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ error: "Erro interno ao buscar pedido" });
  }
});
