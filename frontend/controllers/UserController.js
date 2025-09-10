let error = "";

const setError = (err) => {
  const alertPlaceholder = document.getElementById("myAlert");

  alertPlaceholder.innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show shadow-lg" role="alert">
      ${err}
    </div>
  `;

  setTimeout(() => {
    const alertEl = alertPlaceholder.querySelector(".alert");
    if (alertEl) {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
      bsAlert.close();
    }
  }, 3000);
};

const setSuccess = (msg) => {
  const alertPlaceholder = document.getElementById("myAlert");

  alertPlaceholder.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show shadow-lg" role="alert">
      ${msg}
    </div>
  `;

  setTimeout(() => {
    const alertEl = alertPlaceholder.querySelector(".alert");
    if (alertEl) {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alertEl);
      bsAlert.close();
      location.reload();
    }
  }, 1000);
};

const clearError = () => {
  document.querySelector("h6").classList.add("visually-hidden");
  document.querySelector("h6").innerText = "";
};

const sendRegisterAPI = async (name, email, password, passwordConfirm) => {
  const response = await fetch("http://127.0.0.1:3000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      passwordConfirm,
    }),
  });
  return response;
};

const sendLoginAPI = async (email, password) => {
  const response = await fetch("http://127.0.0.1:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  return response;
};

const saveDataToLocal = (token, email, name) => {
  localStorage.setItem("token", token);
  localStorage.setItem("email", email);
  localStorage.setItem("name", name);
};

async function register() {
  clearError();
  const registeringName = document.getElementById("nameField").value;
  const registeringEmail = document.getElementById("emailField").value;
  const registeringPassword = document.getElementById("passwordField").value;
  const registeringPasswordConfirm = document.getElementById(
    "passwordFieldConfirm"
  ).value;

  const data = await sendRegisterAPI(
    registeringName,
    registeringEmail,
    registeringPassword,
    registeringPasswordConfirm
  );

  if (data.status != 201) {
    const response = await data.json();
    setError(response.message);
    return;
  }

  const res = await data.json();
  saveDataToLocal(res.token, registeringEmail, registeringName);
  setSuccess("Sikeres regisztráció!");
}

async function login() {
  clearError();
  const loggingEmail = document.getElementById("emailField").value;
  const loggingPassword = document.getElementById("passwordField").value;

  if (!loggingEmail || !loggingPassword) {
    setError("Minden mező kitöltése kötelező!");
    return;
  }

  const res = await sendLoginAPI(loggingEmail, loggingPassword);

  if (res.status != 200) {
    const response = await res.json();
    setError(response.message);
    return;
  }

  const data = await res.json();

  saveDataToLocal(data.token, loggingEmail, "Felhasználó");
  setSuccess("Sikeres bejelentkezés!");
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  location.reload();
}

async function getProfile() {
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
  alert("Sikeres JWT ellenőrzés! UserID: " + res.userId);

  handleView("profile");
}

function updateProfile() {}

function updatePassword() {}
