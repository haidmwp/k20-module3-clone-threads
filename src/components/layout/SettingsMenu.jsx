import { AlignLeft, Globe, LogOut, Moon, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toggleTheme } from "@/store/uiSlice";
import { logout, selectUser } from "@/store/authSlice";
import { cn } from "@/lib/utils";

export default function SettingsMenu({ side = "bottom", className }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector((s) => s.ui.theme);
  const user = useSelector(selectUser);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("rounded-xl p-3 text-muted-foreground transition hover:bg-accent hover:text-foreground", className)} aria-label={t("nav.more")}>
          <AlignLeft className="size-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="start">
        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); dispatch(toggleTheme()); }}>
          {t("common.theme")}: {theme === "dark" ? t("common.dark") : t("common.light")}
          {theme === "dark" ? <Moon /> : <Sun />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            i18n.changeLanguage(i18n.language?.startsWith("vi") ? "en" : "vi");
          }}
        >
          {t("common.language")}: {i18n.language?.startsWith("vi") ? "Tiếng Việt" : "English"}
          <Globe />
        </DropdownMenuItem>
        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onSelect={async () => {
                await dispatch(logout());
                navigate("/login");
              }}
            >
              {t("common.logout")}
              <LogOut />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
