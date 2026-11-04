import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">404</h1>
      <Link to="/" className="underline">Về trang chủ</Link>
    </div>
  );
}
