// Disabling submit button
const disableButton = (btnId) => {
  document.getElementById(btnId).disabled = "true";
};

enableButton = (btnId) => {
  setTimeout(
    () => (document.getElementById("submitButton").disabled = false),
    2000
  );
};

const handleLogin = (e, user, pass) => {
  // disabling the button for a few seconds
  disableButton("submitButton");
  document.getElementById("load").innerHTML = "Loading...";
  //   // getting the values from the input fields
  //   const user = document.getElementById("userInput").value;
  //   const pass = document.getElementById("userPassword").value;
  let loginRequest = new XMLHttpRequest();
  loginRequest.onload = () => {
    login = loginRequest.responseText;
    if (login === "true") {
      window.location.replace("../stickyNoteBoard/index.html");
    } else if (login === "false") {
      document.getElementById("load").innerHTML = "Wrong credentials";
      enableButton("submitButton");
      e.preventDefault();
    } else {
      enableButton("submitButton");
      e.preventDefault();
    }
    enableButton("submitButton");
  };
  // sending the credentials to the server for them to be checked
  loginRequest.open(
    "GET",
    `http://localhost:9772/login?user=${user}&password=${pass}`
  );
  loginRequest.onerror = (e) => {
    alert("Server Error");
    document.getElementById("load").innerHTML = "Server Error";
  };
  loginRequest.send();
};

const logIn = (user, pass) => {
  let loginRequest = new XMLHttpRequest();
  // sending the credentials to the server for them to be checked
  loginRequest.open(
    "GET",
    `http://localhost:9772/login?user=${user}&password=${pass}`,
    false
  );
  loginRequest.send();
  if (loginRequest.status === 200) {
    return loginRequest.responseText === "true";
  }
};

module.exports = { logIn };
