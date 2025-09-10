const navbarElem = document.getElementById("navbarElem");

const token = localStorage.getItem("token");
if (token) {
  navbarElem.innerHTML = `
  <li class="nav-item">
      <a id="lepesekFelveteleMenu" class="nav-link" href="#">Lépések Felvétele</a>
    </li>
    <li class="nav-item">
      <a id="lepesekMegtekinteseMenu" class="nav-link" href="#">Lépések Megtekintése</a>
    </li>
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
const lepesekFelveteleMenu = document.getElementById("lepesekFelveteleMenu");
const lepesekMegtekinteseMenu = document.getElementById("lepesekMegtekinteseMenu");
if (profilMenu) {
  profilMenu.addEventListener("click", (e) => {
    e.preventDefault();
    const profile = getProfile();
  });
}
if (lepesekFelveteleMenu) {
  lepesekFelveteleMenu.addEventListener("click", (e) => {
    e.preventDefault();
    handleView("lepesekFelvetele");
  });
}
if (lepesekMegtekinteseMenu) {
  lepesekMegtekinteseMenu.addEventListener("click", (e) => {
    e.preventDefault();
    handleView("lepesekMegtekintese");
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
