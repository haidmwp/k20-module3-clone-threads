import Sidebar from "@/components/layout/Sidebar";
import LoginPanel from "@/components/layout/LoginPanel";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function DefaultLayout({ title, children }) {
  const { isLoggedIn } = useAuth();
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="pb-16 md:pb-0 md:pl-[76px]">
        <div className={cn("mx-auto flex justify-center gap-6 px-0 md:px-4", !isLoggedIn && "lg:pr-[360px] xl:pr-4")}>
          <main className="w-full max-w-[640px]">
            {title && <h1 className="sticky top-0 z-10 bg-background/90 py-4 text-center text-[15px] font-bold backdrop-blur">{title}</h1>}
            {children}
          </main>
        </div>
      </div>
      {!isLoggedIn && <LoginPanel />}
    </div>
  );
}
