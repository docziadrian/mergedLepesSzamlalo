const bcrypt = require("bcrypt");
const saltRounds = 1;

const eredetiJelszo = "Jelszo123";
const cryptedJelszo = bcrypt.hashSync(eredetiJelszo, saltRounds);

const comparePasswords = (typedPasswd, realPasswd) => {
  return bcrypt.compareSync(typedPasswd, realPasswd);
};
