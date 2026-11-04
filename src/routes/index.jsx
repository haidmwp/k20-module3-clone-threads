import { Navigate, Route, Routes } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import Home from "@/pages/Home";
import PostDetail from "@/pages/PostDetail";
import Embed from "@/pages/Embed";
import Placeholder from "@/pages/Placeholder";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";

/** Đã đăng nhập thì không vào các trang auth nữa */
function GuestOnly({ children }) {
  const user = useSelector(selectUser);
  return user ? <Navigate to="/" replace /> : children;
}

function RequireAuth({ children }) {
  const user = useSelector(selectUser);
  return user ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/search" element={<Placeholder titleKey="nav.search" />} />
      <Route path="/activity" element={<RequireAuth><Placeholder titleKey="nav.activity" /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Placeholder titleKey="nav.profile" /></RequireAuth>} />

      <Route path="/:username/post/:postId" element={<PostDetail />} />
      <Route path="/:username/post/:postId/embed" element={<Embed />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
