import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "@/services/authService";
import { tokenStorage, extractTokens } from "@/lib/token";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getUser();
    const d = res.data?.data ?? res.data;
    return d?.user ?? d;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || e.message);
  }
});

export const login = createAsyncThunk("auth/login", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const res = await authService.login(payload);
    tokenStorage.set(extractTokens(res.data));
    const user = res.data?.data?.user;
    if (user) return user;
    return await dispatch(fetchCurrentUser()).unwrap();
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authService.logout();
  } catch {
    /* bỏ qua */
  }
  tokenStorage.clear();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    // nếu có token thì phải load user trước khi render các trang cần auth
    status: tokenStorage.getAccess() ? "loading" : "idle",
  },
  reducers: {
    clearUser(state) {
      state.user = null;
      state.status = "idle";
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchCurrentUser.pending, (s) => void (s.status = "loading"))
      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = "succeeded";
      })
      .addCase(fetchCurrentUser.rejected, (s) => {
        s.user = null;
        s.status = "failed";
      })
      .addCase(login.fulfilled, (s, a) => {
        s.user = a.payload;
        s.status = "succeeded";
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
        s.status = "idle";
      });
  },
});

export const { clearUser } = authSlice.actions;
export const selectUser = (s) => s.auth.user;
export const selectAuthStatus = (s) => s.auth.status;
export default authSlice.reducer;
