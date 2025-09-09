const navbarElem = document.getElementById("navbarElem");

const token = localStorage.getItem("token");
if (token) {
  navbarElem.innerHTML = `
    <li class="nav-item">
      <a id="kilepesMenu" class="nav-link" href="#">Kilépés</a>
    </li>
    <li class="nav-item">
      <a id="profilMenu" class="nav-link" href="#">Profil (${localStorage.getItem(
        "email"
      )})</a>
    </li>
  `;
} else {
  navbarElem.innerHTML = `
  <li class="nav-item">
      <a onclick="handleView('registration')" id="regisztracioMenu" class="nav-link" href="#">Regisztráció</a>
    </li>
  <li class="nav-item">
    <a onclick="handleView('login')" id="belepesMenu" class="nav-link" href="#">
      Belépés
    </a>
  </li>`;
}

const kilepesMenu = document.getElementById("kilepesMenu");
const profilMenu = document.getElementById("profilMenu");
if (profilMenu) {
  profilMenu.addEventListener("click", (e) => {
    e.preventDefault();
    const profile = getProfile();
  });
}
if (kilepesMenu) {
  kilepesMenu.addEventListener("click", (e) => {
    e.preventDefault();
    logout();
    alert("Sikeresen kijelentkeztél.");
    location.reload();
  });
}
