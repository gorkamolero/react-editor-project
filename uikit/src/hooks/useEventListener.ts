import { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

interface UseEventListenerOptions {
  debounceDelay: number;
}

const defaultOptions: UseEventListenerOptions = {
  debounceDelay: 0,
};

export default function useEventListener(
  eventName: string,
  handler: (event: any) => void,
  element?: Window | HTMLElement | null,
  options?: UseEventListenerOptions
) {
  const theElement = (element || (typeof window !== "undefined" ? window : undefined)) as Window | HTMLElement;
  const theOptions: UseEventListenerOptions = { ...defaultOptions, ...options };
  const debouncedHandler = useDebouncedCallback(handler, theOptions.debounceDelay);

  const theHandler = theOptions.debounceDelay > 0 ? debouncedHandler : handler;

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = theElement && theElement.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => theHandler(event);

      // Add event listener
      theElement.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        theElement.removeEventListener(eventName, eventListener);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventName, element] // Re-run if eventName or element changes
  );
}
