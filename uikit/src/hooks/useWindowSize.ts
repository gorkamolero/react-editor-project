import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface Options {
  /**
   * Debounce to use when updating the returned window size.
   */
  debounceDelay: number;
  /**
   * Size to use when performing server-side rendering
   */
  ssrSize: number;
}

const defaultOptions: Options = {
  debounceDelay: 10,
  ssrSize: 1000,
};

export default function useWindowSize(options?: Partial<Options>) {
  const isSSR = typeof window === "undefined";
  const theOptions = { ...defaultOptions, ...options };

  const [windowSize, _setWindowSize] = useState(() => getWindowSize());
  const setWindowSize = useDebouncedCallback(_setWindowSize, theOptions.debounceDelay);

  function getWindowSize() {
    return {
      width: isSSR ? theOptions.ssrSize : window.innerWidth,
      height: isSSR ? theOptions.ssrSize : window.innerHeight,
    };
  }

  useEffect(() => {
    if (isSSR) return;

    function handleResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}
