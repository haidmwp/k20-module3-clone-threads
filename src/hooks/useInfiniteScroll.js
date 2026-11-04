import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Infinite scroll bằng Intersection Observer.
 * fetchPage(page) phải trả về { items, lastPage }.
 * Trả về sentinelRef: gắn vào 1 div ở cuối danh sách.
 */
export default function useInfiniteScroll(fetchPage, deps = []) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);
  const requestId = useRef(0);

  const load = useCallback(
    async (p, reset = false) => {
      if (loadingRef.current && !reset) return;
      const id = ++requestId.current;
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const { items: newItems, lastPage } = await fetchPage(p);
        if (id !== requestId.current) return; // bỏ response cũ khi đã đổi tab
        setItems((prev) => {
          if (reset) return newItems;
          const ids = new Set(prev.map((i) => i.id));
          return [...prev, ...newItems.filter((i) => !ids.has(i.id))];
        });
        setPage(p);
        setHasMore(p < lastPage && newItems.length > 0);
      } catch (e) {
        if (id === requestId.current) setError(e);
      } finally {
        if (id === requestId.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  // reset khi deps (vd: tab) đổi
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    loadingRef.current = false;
    load(1, true);
  }, [load]);

  const sentinelRef = useCallback(
    (node) => {
      observerRef.current?.disconnect();
      if (!node) return;
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingRef.current && !error) load(page + 1);
        },
        { rootMargin: "400px" },
      );
      observerRef.current.observe(node);
    },
    [hasMore, page, load, error],
  );

  const refresh = useCallback(() => load(1, true), [load]);

  return { items, setItems, loading, hasMore, error, sentinelRef, refresh, retry: () => load(page + (items.length ? 1 : 0), !items.length) };
}
