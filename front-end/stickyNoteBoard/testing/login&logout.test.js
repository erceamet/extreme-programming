const login = require("../javascript/login.js");
const logout = require("../javascript/logout.js");

test("Log out", () => {
  expect(logout.logOut()).toBe(true);
});

test("Log in wrong credentials", () => {
  expect(login.logIn("david", "test123")).toBe(false);
});

test("Log in correct credentials", () => {
  expect(login.logIn("test", "test8912")).toBe(true);
});

test("Log in wrong credentials after correct credentials", () => {
  expect(login.logIn("david", "test123")).toBe(true);
});
