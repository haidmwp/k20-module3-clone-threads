import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  try {
    const t = localStorage.getItem("theme");
    if (t) return t;
  } catch {
    /* empty */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const uiSlice = createSlice({
  name: "ui",
  initialState: { theme: getInitialTheme() },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
