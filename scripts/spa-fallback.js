// GitHub Pages không hỗ trợ SPA routing: copy index.html -> 404.html
// để các route như /login, /:username/post/:id/embed vẫn mở được khi F5.
import { copyFileSync } from "node:fs";
copyFileSync("dist/index.html", "dist/404.html");
console.log("Created dist/404.html (SPA fallback)");
