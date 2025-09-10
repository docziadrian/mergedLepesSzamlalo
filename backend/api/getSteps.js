export async function getSteps(req, res, db, jwt, JWT_SECRET, userID) {
  const id = parseInt(userID);
  console.log("Sikeres parseolás! " + id);
  const user = await db.get("SELECT * FROM users WHERE id = ?", id);
  if (!user) {
    return res.status(403).json({ message: "Nem létezik ilyen felhasználó." });
  }

  return res
    .status(200)
    .json({ message: { userName: user.name, userStepInfos: user.stepInfos } });
}
