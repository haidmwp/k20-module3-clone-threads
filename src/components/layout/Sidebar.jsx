import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useTranslation } from "react-i18next";
import { Heart, Home, Plus, Search, User } from "lucide-react";
import Logo from "@/components/layout/Logo";
import SettingsMenu from "@/components/layout/SettingsMenu";
import ReplyModal from "@/components/post/ReplyModal";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const itemCls = ({ isActive }) =>
  cn(
    "flex h-12 w-14 items-center justify-center rounded-xl transition hover:bg-accent",
    isActive ? "text-foreground" : "text-muted-foreground",
  );

export default function Sidebar() {
  const { t } = useTranslation();
  const { user, requireAuth } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);

  const items = [
    { to: "/", icon: Home, label: t("nav.home"), end: true },
    { to: "/search", icon: Search, label: t("nav.search") },
    { create: true, icon: Plus, label: t("nav.create") },
    { to: "/activity", icon: Heart, label: t("nav.activity") },
    { to: user ? "/profile" : "/login", icon: User, label: t("nav.profile") },
  ];

  return (
    <>
      {/* Desktop: sidebar trái */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[76px] flex-col items-center justify-between py-5 md:flex">
        <Link to="/" aria-label="Threads" className="transition hover:scale-105">
          <Logo />
        </Link>
        <nav className="flex flex-col items-center gap-2">
          {items.map((it) =>
            it.create ? (
              <button
                key="create"
                aria-label={it.label}
                title={it.label}
                onClick={requireAuth(() => setOpenCreate(true))}
                className="flex h-12 w-14 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition hover:text-foreground"
              >
                <it.icon className="size-6" />
              </button>
            ) : (
              <NavLink key={it.to} to={it.to} end={it.end} aria-label={it.label} title={it.label} className={itemCls}>
                {({ isActive }) => <it.icon className="size-6" strokeWidth={isActive ? 2.6 : 2} />}
              </NavLink>
            ),
          )}
        </nav>
        <SettingsMenu side="right" />
      </aside>

      {/* Mobile: thanh điều hướng dưới */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur md:hidden">
        {items.map((it) =>
          it.create ? (
            <button key="create" aria-label={it.label} onClick={requireAuth(() => setOpenCreate(true))} className={itemCls({ isActive: false })}>
              <it.icon className="size-6" />
            </button>
          ) : (
            <NavLink key={it.to} to={it.to} end={it.end} aria-label={it.label} className={itemCls}>
              {({ isActive }) => <it.icon className="size-6" strokeWidth={isActive ? 2.6 : 2} />}
            </NavLink>
          ),
        )}
      </nav>
      <div className="fixed top-3 right-3 z-20 md:hidden">
        <SettingsMenu />
      </div>

      <ReplyModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        mode="create"
        onSuccess={() => window.dispatchEvent(new Event("post:created"))}
      />
    </>
  );
}
