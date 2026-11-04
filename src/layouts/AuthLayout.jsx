import { Link } from "react-router";
import Logo from "@/components/layout/Logo";
import SettingsMenu from "@/components/layout/SettingsMenu";

export default function AuthLayout({ title, children }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4">
        <SettingsMenu />
      </div>
      <Link to="/" className="mb-8">
        <Logo className="size-12" />
      </Link>
      <div className="w-full max-w-[370px]">
        {title && <h1 className="mb-4 text-center text-base font-bold">{title}</h1>}
        {children}
      </div>
    </div>
  );
}
