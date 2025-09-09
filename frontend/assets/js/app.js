const AppTitle = "Lépésszámláló Applikáció";
const Author = "Dóczi Adrián Márk";
const Company = "Bajai SZC - Türr István Technikum";
const Year = new Date().getFullYear();

let title = document.querySelector("title");
if (title) {
  title.textContent = AppTitle;
}

let author = document.getElementById("author");
if (author) {
  author.textContent = Author;
}

let company = document.getElementById("company");
if (company) {
  company.textContent = Company;
}

let datum = document.getElementById("datum");
if (datum) {
  datum.textContent = `${Year}.09.08`;
}

const loadTheme = () => {
  const theme = localStorage.getItem("SCTheme") || "white";
  document.documentElement.setAttribute("data-bs-theme", theme);
  setTheme(theme);
};

const saveTheme = () => {
  const theme = document.documentElement.getAttribute("data-bs-theme");
  localStorage.setItem("SCTheme", theme);
};

const setTheme = (theme) => {
  if (theme === "light" || theme === "dark") {
    document.documentElement.setAttribute("data-bs-theme", theme);
    saveTheme();
    handleButtons(theme);
    return;
  }
};

const handleButtons = (theme) => {
  const button = document.querySelector(`.B${theme}`);
  if (button) {
    button.classList.add("visually-hidden");
    button.disabled = true;
  }

  const otherButton = document.querySelector(
    `.B${theme === "light" ? "dark" : "light"}`
  );
  if (otherButton) {
    otherButton.classList.remove("visually-hidden");
    otherButton.disabled = false;
  }
};

loadTheme();
handleButtons(
  document.documentElement.getAttribute("data-bs-theme") || "white"
);

// menupont #1 - Belépés
// menupont #2 - Regisztráció

const belepesMenu = document.getElementById("belepesMenu");
if (belepesMenu) {
  belepesMenu.addEventListener("click", (e) => {
    e.preventDefault();
    handleView("login");
  });
}

const regisztracioMenu = document.getElementById("regisztracioMenu");
if (regisztracioMenu) {
  regisztracioMenu.addEventListener("click", (e) => {
    e.preventDefault();
    handleView("registration");
  });
}

const handleView = async (view) => {
  //main tartalom betöltése
  const main = document.querySelector("main");
  main.innerHTML = ""; // töröljük a main tartalmát
  main.innerHTML = await fetch(`./views/${view}.html`).then((response) => {
    return response.text();
  });
};
