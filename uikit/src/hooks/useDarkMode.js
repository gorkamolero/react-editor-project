import usePrefersDarkMode from "./usePrefersDarkMode";
import useLocalStorage from "./useLocalStorage";
import { useEffect, useMemo } from "react";

export default function useDarkMode() {
  const [enabled, setEnabled, resetEnabled] = useLocalStorage("dark-mode-enabled");

  // See if user has set a browser or OS preference for dark mode.
  const systemDarkModeQuery = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)");
    }
  }, []);
  let prefersDarkMode = systemDarkModeQuery?.matches;

  // This allows user to override OS level setting on our website.
  const userDarkModeSet = typeof enabled !== "undefined";
  const isEnabled = userDarkModeSet ? enabled : prefersDarkMode;

  function setDarkMode() {
    document.documentElement.classList.add("dark-mode");
    document.documentElement.classList.remove("light-mode");
  }

  function setLightMode() {
    document.documentElement.classList.add("light-mode");
    document.documentElement.classList.remove("dark-mode");
  }

  useEffect(() => {
    if (document && document.documentElement) {
      if (isEnabled) {
        setDarkMode();
      } else {
        setLightMode();
      }
    }
  }, [isEnabled]);

  useEffect(() => {
    function handleDarkTheme(e) {
      if (e?.matches) {
        setDarkMode();
      } else {
        setLightMode();
      }
    }

    // fix for older browsers that don't have `addEventListener` on the query
    // https://sentry.io/organizations/mailbrew/issues/2075245409/?referrer=Linear
    if (!systemDarkModeQuery || typeof systemDarkModeQuery.addEventListener !== "function") return;

    systemDarkModeQuery?.addEventListener("change", handleDarkTheme);
    return () => systemDarkModeQuery?.removeEventListener("change", handleDarkTheme);
  }, [systemDarkModeQuery]);

  // Return enabled state and setter
  return [isEnabled, setEnabled, resetEnabled];
}

/**
 To remove white flashing, use this on index.html

 @example
  <script>
    const userDarkMode = localStorage["dark-mode-enabled"];
    const systemDarkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    let systemDarkModeOn = systemDarkModeQuery.matches;

    const userDarkModeSet = typeof userDarkMode !== "undefined";

    function setDarkMode() {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.remove("light-mode");
    }

    function setLightMode() {
      document.documentElement.classList.add("light-mode");
      document.documentElement.classList.remove("dark-mode");
    }

    if (userDarkModeSet ? userDarkMode === "true" : systemDarkModeOn) {
      setDarkMode();
    } else {
      setLightMode();
    }

    systemDarkModeQuery.addEventListener("change", e => {
      if (e?.matches) {
        setDarkMode();
      } else {
        setLightMode();
      }
    });
  </script>

  @description
  Palettes are then defined as follows:

  @example
  :root, :root.light-mode {
    ...light colors
  }
  :root.dark-mode {
    ...dark color
  }
  body {
    background: var(--bg0);
  }
 */
