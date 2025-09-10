document.addEventListener("DOMContentLoaded", function () {
  // Alapértelmezett dátum beállítása (ma)
  document.getElementById("selectedDate").valueAsDate = new Date();

  // Lépések input validálása
  const stepsInput = document.getElementById("lepesek");
  stepsInput.addEventListener("input", function () {
    const value = parseInt(this.value);
    if (value > 0) {
      updateMotivationMessage(value);
    }
  });
});

function setSteps(steps) {
  document.getElementById("lepesek").value = steps;
  updateMotivationMessage(steps);
}

async function updateMotivationMessage(steps) {
  const messageEl = document.getElementById("motivationMessage");
  let message = "";

  if (steps >= 15000) {
    message =
      '<i class="bi bi-trophy me-2 text-warning"></i>Fantasztikus! Túlteljesítetted a napi célt!';
  } else if (steps >= 10000) {
    message =
      '<i class="bi bi-star me-2 text-success"></i>Kiváló! Elérted a napi célt!';
  } else if (steps >= 8000) {
    message =
      '<i class="bi bi-heart-pulse me-2 text-primary"></i>Jó munkát! Közel vagy a célhoz!';
  } else if (steps >= 5000) {
    message =
      '<i class="bi bi-arrow-up me-2 text-info"></i>Szép kezdés! Próbálj még többet sétálni!';
  } else {
    message =
      '<i class="bi bi-heart-pulse me-2 text-danger"></i>Minden lépés számít az egészségedért!';
  }

  messageEl.innerHTML = message;
}

async function saveSteps() {
  const steps = document.getElementById("lepesek").value;
  const date = document.getElementById("selectedDate").value;

  if (!steps || steps <= 0) {
    showErrorToast("Kérlek adj meg egy érvényes lépésszámot!");
    return;
  }

  const userID = 7;

  const stepInfos = `${date},${parseInt(steps)}`;
  const response = await fetch("http://127.0.0.1:3000/user/newStep", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stepInfos,
      userId: userID,
    }),
  });
  return response;
}

showSuccessToast("Lépések sikeresen mentve!");

handleView("lepesekMegtekintese");

// Form törlése
document.getElementById("lepesek").value = "";
updateMotivationMessage(0);

function clearSteps() {
  document.getElementById("lepesek").value = "";
  updateMotivationMessage(0);
}

function showHistory() {
  // Itt történne az előzmények megjelenítése
  console.log("Előzmények megjelenítése");
}

function showSuccessToast(message) {
  const toast = new bootstrap.Toast(document.getElementById("successToast"));
  document.querySelector("#successToast .toast-body").textContent = message;
  toast.show();
}

function showErrorToast(message) {
  const toast = new bootstrap.Toast(document.getElementById("errorToast"));
  document.querySelector("#errorToast .toast-body").textContent = message;
  toast.show();
}
