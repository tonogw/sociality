export function clearSession() {
  localStorage.removeItem("token");

  document.cookie =
    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}
