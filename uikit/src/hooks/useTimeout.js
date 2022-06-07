import { useEffect } from "react";

export default function useTimeout(func, delay, deps) {
  useEffect(() => {
    let timeout = setTimeout(func, delay);
    return () => clearTimeout(timeout);
  }, [deps, delay, func]);
}
