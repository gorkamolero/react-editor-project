import { useEffect } from "react";

export default function useClickOutside(ref, handler, deps, options) {
  const effectDeps = [ref.current].concat(deps || []);
  const { ignoredRefs = [], isClickOutside } = options || {};

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const handleClickOutside = (event) => {
      if (isClickOutside && !isClickOutside(event)) {
        return;
      }
      if (
        !element.contains(event.target) &&
        !ignoredRefs.find(
          (ref) =>
            ref.current && (ref.current === event.target || ref.current.contains(event.target))
        )
      ) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectDeps);
}
