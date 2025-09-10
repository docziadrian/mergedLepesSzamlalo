export async function createStep(req, res, db, jwt, JWT_SECRET) {
  const data = req.body;
  const { userId, stepInfos } = data;

  const user = await db.get("SELECT * FROM users WHERE id = ?", userId);
  if (!user) {
    return res.status(402).json({ message: "Ilyen felhasználó nem létezik!" });
  }
  var allStepInfos = "";
  allStepInfos = user.stepInfos + stepInfos + ";";

  db.run("UPDATE users SET stepInfos = ? WHERE id = ?", allStepInfos, userId);

  console.log(user.stepInfos);

  return res.status(200).json({ message: user.stepInfos });
}
