export async function register(req, res, db, jwt, JWT_SECRET) {
  const passwdRegex = new RegExp(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  );
  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  const data = req.body;
  const { name, email, password, passwordConfirm } = data;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "A jelszavak nem egyeznek meg!" });
  }

  if (!password.match(passwdRegex)) {
    return res.status(400).json({
      message:
        "A jelszónak legalább 8 karakter hosszúnak kell lennie, tartalmaznia kell legalább egy betűt és egy számot!",
    });
  }

  if (!email.match(emailRegex)) {
    return res.status(400).json({ message: "Érvénytelen email cím!" });
  }

  const user = await db.get("SELECT * FROM users WHERE email = ?", email);
  if (user) {
    return res.status(400).json({ message: "Ez az emailcím már foglalt!" });
  }

  function generateRandomImagePath() {
    const randomNum = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/id/${randomNum}/200/200`;
  }

  var imgPath = generateRandomImagePath();

  await db.run(
    "INSERT INTO users (name, email, password, imgPath) VALUES (?, ?, ?, ?)",
    name,
    email,
    password,
    imgPath
  );

  const userAfterInsert = await db.get(
    "SELECT * FROM users WHERE email = ?",
    email
  );

  //JWT LÉTREHOZÁSA
  const token = jwt.sign(
    {
      id: userAfterInsert.id,
      email: userAfterInsert.email,
      imgPath: userAfterInsert.imgPath,
    },
    JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  res.status(201).json({ message: "Sikeres regisztráció!", token: token });
}
