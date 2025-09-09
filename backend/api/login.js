export async function login(req, res, db, jwt, JWT_SECRET) {
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
  const token = jwt.sign(
    { id: user.id, email: user.email, imgPath: user.imgPath },
    JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );

  // itt majd ellenőrzés az adatbázissal
  console.log(email + " bejelentkezett");
  return res
    .status(200)
    .json({ message: "Sikeres bejelentkezés!", token: token });
}
