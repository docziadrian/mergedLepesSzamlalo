const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { login } = require("./api/login");
const { register } = require("./api/register");
const { createStep } = require("./api/createStep");
const { getSteps } = require("./api/getSteps");

const JWT_SECRET = "nagyonTitkosKulcs";

//    adatbázis nyitás egyszer
let db;
(async () => {
  db = await open({
    filename: "./database/users.db",
    driver: sqlite3.Database,
  });

  // ha nincs users tábla, létrehozzuk

  //stepInfos: id, steps, date
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      imgPath TEXT,
      stepInfos TEXT
    )
  `);

  await db.exec(`
      CREATE TABLE IF NOT EXISTS steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userID INTEGER,
        steps INTEGER,
        date TEXT
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
  register(req, res, db, jwt, JWT_SECRET);
});

app.post("/auth/login", async (req, res) => {
  login(req, res, db, jwt, JWT_SECRET);
});

app.post("/user/newStep", async (req, res) => {
  createStep(req, res, db, jwt, JWT_SECRET);
});

app.get("/user/getSteps/:id", async (req, res) => {
  const userID = req.params.id;
  getSteps(req, res, db, jwt, JWT_SECRET, userID);
});

//JWT ellenőrző middleware
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ message: "Nincs token megadva!" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Érvénytelen token!" });
    }
    const specUser = db.run("SELECT * FROM users WHERE id = ?", [decoded.id]);
    if (!specUser) {
      return res.status(404).json({ message: "Felhasználó nem található!" });
    }
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userName = decoded.name;
    req.imgPath = decoded.imgPath;
    req.stepInfos = decoded.stepInfos;

    console.log("JWT ellenőrzés sikeres, userId:", decoded.stepInfos);

    next();
  });
};

//Send a test JWT token
app.get("/verify-jwt", verifyJWT, (req, res) => {
  const userId = req.userId;
  // Find user by userId in the database (optional)

  res.json({
    message: "Sikeres JWT ellenőrzés!",
    userId: req.userId,
    userEmail: req.userEmail,
    userName: req.userName,
    imgPath: req.imgPath,
    stepInfos: req.stepInfos,
  });
});

app.listen("3000");
