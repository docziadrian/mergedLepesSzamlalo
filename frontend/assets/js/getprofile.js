async function getProfileFrontend() {
  const token = localStorage.getItem("token");
  if (!token) {
    setError("Nincs bejelentkezve!");
    return;
  }
  const data = await fetch("http://localhost:3000/verify-jwt", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });

  if (data.status !== 200) {
    setError("Érvénytelen token, kérjük jelentkezzen be újra!");
    logout();
    return;
  }
  const res = await data.json();

  const { userEmail, userId, imgPath } = res;
  if (!userEmail || !userId) {
    setError("Hibás válasz a szervertől!");
    logout();
    return;
  }
  const nevElement = document.querySelector("#nev");
  const emailElement = document.querySelector("#email");

  const kepElement = document.querySelector("#kep");
  if (kepElement) {
    kepElement.src = imgPath;
  }

  if (nevElement && emailElement) {
    nevElement.value = userEmail;
    emailElement.value = imgPath;
    nevElement.innerText = userEmail;
    emailElement.innerText = userEmail;
  } else {
    setError("Hiányzó HTML elemek!");
  }
}
const getProfileHandler = () => {
  const card = document.querySelector(".card");
  card.classList.toggle("visually-hidden");
  getProfileFrontend();
};
