import { useEffect } from "react";
import usePrevious from "./usePrevious";

const STYLE_ID = "uikit-lock-scrolling";

export default function useLockBodyScroll(lock) {
  function lockBodyScroll() {
    // append style to head
    if (document.querySelector("#" + STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      body {
        overflow: hidden !important;
        -webkit-overflow-scrolling: none !important;
        touch-action: none !important;
        overscroll-behavior: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function unlockBodyScroll() {
    if (document.querySelector("#" + STYLE_ID)) {
      document.head.removeChild(document.querySelector("#" + STYLE_ID));
    }
  }

  const wasLocked = usePrevious(lock);

  useEffect(() => {
    if (lock) {
      lockBodyScroll();
    } else if (wasLocked) {
      // Only unlock if it was previously locked
      unlockBodyScroll();
    }
  }, [lock, wasLocked]);

  useEffect(() => {
    return () => unlockBodyScroll();
  }, []);

  return [lockBodyScroll, unlockBodyScroll];
}

function getStyle(styleName) {
  return typeof window !== "undefined" ? window.getComputedStyle(document.body)[styleName] : "";
}
