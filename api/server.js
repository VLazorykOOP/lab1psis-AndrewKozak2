const express = require("express");
const { Pool } = require("pg"); // Імпортуємо клієнт для PostgreSQL

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
});

app.use(express.json());

app.post("/api/message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const queryText =
      "INSERT INTO messages(name, email, message) VALUES($1, $2, $3)";
    await pool.query(queryText, [name, email, message]);

    console.log("✅ Нове повідомлення успішно збережено в Базу Даних!");

    res
      .status(201)
      .json({ status: "success", message: "Повідомлення збережено!" });
  } catch (err) {
    console.error("❌ Помилка при збереженні повідомлення:", err);
    res.status(500).json({ status: "error", message: "Помилка на сервері" });
  }
});

async function initDbAndStartServer() {
  let retries = 5;
  while (retries) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Базу даних успішно підключено!");

      const createTableQuery = `
          CREATE TABLE IF NOT EXISTS messages (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL,
              message TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
      await pool.query(createTableQuery);
      console.log('✅ Таблиця "messages" успішно перевірена/створена.');

      app.listen(port, () => {
        console.log(`API server running on http://localhost:${port}`);
      });
      return;
    } catch (err) {
      console.error("❌ Не вдалося підключитися до БД:", err.code);
      retries -= 1;
      console.log(
        `Залишилось спроб: ${retries}. Повторна спроба через 5 секунд...`
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.error(
    "❌ Не вдалося запустити API: неможливо підключитися до бази даних після 5 спроб."
  );
  process.exit(1);
}

initDbAndStartServer();
