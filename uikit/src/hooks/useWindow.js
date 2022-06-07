import { useEffect, useRef } from "react";

/**
 * We need this to fix "document/window undefined" in Gatsby.
 */
export default function useWindow() {
  const windowRef = useRef(typeof window !== "undefined" ? window : null);
  useEffect(() => {
    if (!windowRef.current) {
      windowRef.current = window;
    }
  }, []);
  return windowRef.current;
}
