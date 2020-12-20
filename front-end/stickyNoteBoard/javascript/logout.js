const logout = () => {
  let logoutRequest = new XMLHttpRequest();
  logoutRequest.onload = () => {
    logoutMessage = logoutRequest.responseText;

    console.log(logoutRequest.responseText);
    if (logoutMessage === "true") {
      window.location.replace("../stickyNoteBoard/index.html");
    } else if (logoutMessage === "false") {
      alert("Wrong credentials");
      document.getElementById("load").innerHTML = "Wrong credentials";
      e.preventDefault();
    } else {
      e.preventDefault();
    }
  };
  logoutRequest.open("GET", "http://localhost:9772/logout", false);
  logoutRequest.onerror = (e) => {
    alert("Server Error");
    document.getElementById("load").innerHTML = "Server Error";
  };
  logoutRequest.send();
};

const logOut = () => {
  let logoutRequest = new XMLHttpRequest();
  logoutRequest.open("GET", "http://localhost:9772/logout", false);
  logoutRequest.send();
  if (logoutRequest.status === 200) {
    return logoutRequest.responseText === "true";
  }
};

module.exports = { logout, logOut };
