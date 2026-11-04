import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/authSlice";
import uiReducer from "@/store/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

// đồng bộ theme ra <html class="dark"> + localStorage
let lastTheme;
store.subscribe(() => {
  const { theme } = store.getState().ui;
  if (theme === lastTheme) return;
  lastTheme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* empty */
  }
});
