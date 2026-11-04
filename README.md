# Threads Clone – Dự án cuối module 3 (F8 FS NodeJS K20)

Ứng dụng mạng xã hội dạng **Threads** viết bằng React + Vite, kết nối API `https://threads.f8team.dev`.

- **Repository:** `https://github.com/<username>/k20-module3-clone-threads`
- **Live demo (GitHub Pages):** `https://<username>.github.io/k20-module3-clone-threads/`

## Công nghệ

| Mục đích | Thư viện |
| --- | --- |
| Build | Vite, alias `@` / `~` → `src` (vite.config.js + jsconfig.json) |
| UI | Tailwind CSS v4, Shadcn UI (Radix), lucide-react, dark/light mode, responsive |
| Routing | React Router v7 |
| Global state | Redux Toolkit (`auth`, `ui`) |
| HTTP | Axios + interceptor tự refresh token |
| Form | react-hook-form + zod |
| Đa ngôn ngữ | react-i18next (Tiếng Việt / English) |
| Khác | copy-to-clipboard, html-to-image, sonner (toast) |

## Cài đặt & chạy

```bash
npm install
cp .env.example .env    # Windows: copy .env.example .env
npm run dev             # http://localhost:5173
npm run build           # build ra thư mục dist
```

### Biến môi trường

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://threads.f8team.dev` | BASE_URL của API |
| `VITE_BASE_PATH` | `/` | Base path khi deploy (GitHub Pages: `/k20-module3-clone-threads/`) |

Khi đăng ký và quên mật khẩu, app gửi header `x-origin` = origin của frontend để link trong email trỏ về `/verify-email?token=...` và `/reset-password?token=...`.

## Deploy GitHub Pages

1. Push code lên nhánh `main` của repo `k20-module3-clone-threads`.
2. Vào **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` tự build (base path = tên repo) và deploy. Script `scripts/spa-fallback.js` tạo `404.html` để các route SPA (vd. `/login`, `/:username/post/:id/embed`) mở được khi F5.

Deploy Vercel: import repo, không cần cấu hình thêm (`vercel.json` đã có rewrite SPA).

## Cấu trúc thư mục

```
src/
├── components/
│   ├── ui/            # button, input, dialog, dropdown-menu, avatar... (shadcn)
│   ├── layout/        # Sidebar, LoginPanel, SettingsMenu, Logo
│   └── post/          # PostCard, InteractionBar, PostMenu, ShareMenu,
│                      # ReplyModal, QuoteModal, EmbedModal, CopyImageModal,
│                      # ConfirmDialog, ReportModal, PostMedia, QuotedPost
├── hooks/             # useDebounce, useInfiniteScroll, useAuth
├── i18n/              # cấu hình i18next + locales/vi.json, en.json
├── layouts/           # AuthLayout, DefaultLayout, EmbedLayout
├── lib/               # http (axios + refresh token), token, utils, post
├── pages/
│   ├── Auth/          # Register, Login, VerifyEmail, ForgotPassword, ResetPassword
│   ├── Home.jsx       # feed 3 tab + infinite scroll
│   ├── PostDetail.jsx # chi tiết post + danh sách comment
│   └── Embed.jsx      # /:username/post/:postId/embed
├── routes/            # khai báo route
├── services/          # authService, postService
└── store/             # Redux Toolkit: authSlice, uiSlice
```

## Chức năng

- **Register:** validate bằng zod; kiểm tra username/email đã tồn tại sau khi ngừng gõ 700 ms; map lỗi 422 của API vào từng field; hiển thị thông báo đã gửi email xác thực.
- **VerifyEmail:** đọc `token` trên URL → gọi API → thành công thì về `/login` với state `{ verified: true }`.
- **Login:** lưu `access_token` / `refresh_token` vào localStorage, gọi `GET /auth/user`, lưu user vào Redux. Interceptor tự gắn token; khi gặp 401 thì refresh **một lần** cho mọi request đang chờ rồi gửi lại; refresh thất bại thì về `/login`.
- **ForgotPassword / ResetPassword:** kiểm tra token reset, form mật khẩu mới, chuyển về `/login` kèm message.
- **Home:** tab For you / Following / Ghost posts, infinite scroll (Intersection Observer). Like/Repost cập nhật optimistic và rollback nếu lỗi. Có Reply, Quote, Share (copy link, copy as image, embed code) và menu ba chấm (Save, Not interested, Mute, Restrict, Block + confirm, Report + chọn lý do, Copy link, Edit/Delete cho post của mình). Chưa đăng nhập thì hiện LoginPanel.
- **ReplyModal:** avatar + username, toolbar (ảnh/video, GIF, emoji, poll, location), Add a topic, Add to thread, Reply options; nút Post bị disable khi chưa có nội dung.
- **Embed:** EmbedModal có preview bằng iframe và copy code; trang embed nền trắng, không sidebar, có link "View on Threads".
