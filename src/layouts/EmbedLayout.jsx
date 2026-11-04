/** Layout cho iframe: full width, không sidebar/nav/footer, nền trắng */
export default function EmbedLayout({ children }) {
  return <main className="theme-light min-h-dvh w-full">{children}</main>;
}
