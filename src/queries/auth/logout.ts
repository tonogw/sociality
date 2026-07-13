import { AppDispatch } from "@/store";
import { logout } from "@/store";

export function performLogout(dispatch: AppDispatch) {
  dispatch(logout());

  localStorage.removeItem("token");

  document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";

  sessionStorage.clear();
}

// IF BACKEND HAS LOGOUT ENDPOINT
// await authService.logout();
// performLogout(dispatch);
