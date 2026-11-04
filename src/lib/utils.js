import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** "2026-11-04T06:59:54Z" -> "2h", "3d", "12/10/2026" */
export function timeAgo(date, lang = "vi") {
  if (!date) return "";
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return lang === "vi" ? "vừa xong" : "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d`;
  return new Date(date).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US");
}

export function formatCount(n = 0) {
  if (!n) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

/** Lấy message lỗi từ response API Laravel */
export function getErrorMessage(error, fallback = "Đã có lỗi xảy ra") {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    if (Array.isArray(first) && first[0]) return first[0];
  }
  return data?.message || error?.message || fallback;
}

/** Map errors {field: [msg]} của API vào react-hook-form setError */
export function applyServerErrors(error, setError, fieldMap = {}) {
  const errors = error?.response?.data?.errors;
  if (!errors) return false;
  Object.entries(errors).forEach(([field, msgs]) => {
    const name = fieldMap[field] || field;
    setError(name, { type: "server", message: Array.isArray(msgs) ? msgs[0] : msgs });
  });
  return true;
}

/** Link tuyệt đối tới 1 trang trong app (có tính base path khi deploy GitHub Pages) */
export function appUrl(path = "") {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${location.origin}${base}/${path.replace(/^\//, "")}`;
}

export function postPath(post) {
  return `/${post?.user?.username}/post/${post?.id}`;
}
