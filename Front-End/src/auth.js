// TEMPORARY LOGIN
// These accounts live in the browser code, so anyone who opens the site's
// developer tools can read them. Use this only while building.
// When your backend login is ready, replace the body of login() with an
// api.post(...) call that returns the person's name and role.

const KEY = "medicare_user";

const ACCOUNTS = [
  { email: "admin@medicare.com", password: "admin123", name: "Admin User", role: "admin" },
  { email: "user@medicare.com", password: "user123", name: "Staff User", role: "user" },
];

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export async function login(email, password) {
  const match = ACCOUNTS.find(
    (a) => a.email === email.trim().toLowerCase() && a.password === password
  );
  if (!match) throw new Error("Email or password is not correct.");

  const user = { name: match.name, email: match.email, role: match.role };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY);
}