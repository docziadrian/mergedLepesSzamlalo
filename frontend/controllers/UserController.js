let error = "";

const setError = (err) => {
  error = err;
  document.querySelector("h6").classList.remove("visually-hidden");
  document.querySelector("h6").innerText = error;
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
  alert("Sikeresen beléptél. Tokened: " + res.token);
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
  alert("Sikeresen beléptél. Tokened: " + data.token);
  saveDataToLocal(data.token, loggingEmail, "Felhasználó");
  // oldal újratöltése
  location.reload();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  location.reload();
}

function getProfile() {
  return {
    email: localStorage.getItem("email"),
    name: localStorage.getItem("name"),
  };
}

function updateProfile() {}

function updatePassword() {}
