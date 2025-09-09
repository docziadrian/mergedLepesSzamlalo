const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "nagyonTitkosKulcs";

//    adatbázis nyitás egyszer
let db;
(async () => {
  db = await open({
    filename: "./database/users.db",
    driver: sqlite3.Database,
  });

  // ha nincs users tábla, létrehozzuk
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
})();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend szerver fut!");
});

app.post("/auth/register", async (req, res) => {
  const data = req.body;
  const { name, email, password, passwordConfirm } = data;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "A jelszavak nem egyeznek meg!" });
  }

  const user = await db.get("SELECT * FROM users WHERE email = ?", email);
  if (user) {
    return res.status(400).json({ message: "Ez az emailcím már foglalt!" });
  }

  await db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    name,
    email,
    password
  );

  const userAfterInsert = await db.get(
    "SELECT * FROM users WHERE email = ?",
    email
  );

  //JWT LÉTREHOZÁSA
  const token = jwt.sign(
    { id: userAfterInsert.id, email: userAfterInsert.email },
    JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  res.status(201).json({ message: "Sikeres regisztráció!", token: token });
});

app.post("/auth/login", async (req, res) => {
  const data = req.body;
  const { email, password } = data;

  if (!email || !password) {
    return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
  }

  let user = await db.get("SELECT * FROM users WHERE email = ?", email);
  if (!user) {
    return res.status(402).json({ message: "Ilyen felhasználó nem létezik!" });
  }

  if (user.password != password) {
    return res.status(403).json({ message: "Hibás jelszó!" });
  }

  //JWT LÉTREHOZÁSA
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "12h",
  });

  // itt majd ellenőrzés az adatbázissal
  console.log(email + " bejelentkezett");
  return res
    .status(200)
    .json({ message: "Sikeres bejelentkezés!", token: token });
});

app.listen("3000");
