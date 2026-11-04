import http from "@/lib/http";

const toFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) v.forEach((item) => fd.append(`${k}[]`, item));
    else fd.append(k, v);
  });
  return fd;
};

const postService = {
  // ===== Feed & post =====
  /** type: for_you | following | ghost */
  getFeed: ({ type = "for_you", page = 1, per_page = 10 } = {}) =>
    http.get("/posts/feed", { params: { type, page, per_page } }),
  getPost: (id) => http.get(`/posts/${id}`),
  getReplies: (id, { page = 1, per_page = 20 } = {}) =>
    http.get(`/posts/${id}/replies`, { params: { page, per_page } }),
  createPost: ({ content, media = [], reply_permission = "everyone", is_ghost } = {}) =>
    http.post("/posts", toFormData({ content, media, reply_permission, is_ghost: is_ghost ? 1 : undefined })),
  updatePost: (id, { content, media = [] }) =>
    http.post(`/posts/${id}`, toFormData({ _method: "PUT", content, media })),
  deletePost: (id) => http.post(`/posts/${id}`, { _method: "DELETE" }),

  // ===== Interactions =====
  /** Like / Unlike (toggle) */
  toggleLike: (id) => http.post(`/posts/${id}/like`),
  /** Repost / Un-repost (toggle) */
  toggleRepost: (id) => http.post(`/posts/${id}/repost`),
  reply: (id, { content, media = [], reply_permission }) =>
    http.post(`/posts/${id}/reply`, toFormData({ content, media, reply_permission })),
  quote: (id, { content, media = [], reply_permission }) =>
    http.post(`/posts/${id}/quote`, toFormData({ content, media, reply_permission })),

  // ===== Post menu =====
  /** Save / Unsave vào collection (toggle) */
  toggleSave: (id) => http.post(`/posts/${id}/save`),
  /** Not interested -> ẩn post */
  hide: (id) => http.post(`/posts/${id}/hide`),
  report: (id, { reason, description = "" }) => http.post(`/posts/${id}/report`, { reason, description }),
  muteUser: (userId) => http.post(`/users/${userId}/mute`),
  restrictUser: (userId) => http.post(`/users/${userId}/restrict`),
  blockUser: (userId) => http.post(`/users/${userId}/block`),
  followUser: (userId) => http.post(`/users/${userId}/follow`),

  uploadMedia: (files) => http.post("/upload/media", toFormData({ media: files })),
};

export default postService;
