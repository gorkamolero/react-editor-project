import { useEffect, useState } from "react";
import { isClient } from "../env";

export default function useDetectBrowser() {
  const [detectedBrowser, setDetectedBrowser] = useState<ReturnType<typeof getDetectedBrowser>>(() =>
    getDetectedBrowser()
  );
  useEffect(() => {
    setDetectedBrowser(getDetectedBrowser());
  }, []);
  return detectedBrowser;
}

function getDetectedBrowser() {
  return {
    platform: isClient ? detectPlatform() : "Mac",
    browser: isClient ? (detectBrowser() as ReturnType<typeof detectBrowser>) : "chrome",
    isAndroid: isClient ? detectAndroid() : false,
    isIos: isClient ? detectIOS() : false,
    isIPad: isClient ? detectIPad() : false,
    hasTouch: isClient ? detectTouch() : false,
    isIPhone: isClient ? detectIPhone() : false,
    isMac: isClient ? detectPlatform() === "Mac" : false,
    isWindows: isClient ? detectPlatform() === "Windows" : false,
    isPwa: isClient ? detectStandaloneMode() : false,
  };
}

const userAgent = () => (window && window.navigator && window.navigator.userAgent.toLowerCase()) ?? "";

function detectIPhone() {
  return /iphone|ipod/.test(userAgent());
}

function detectIPad() {
  return (
    !/iphone|ipod/.test(userAgent()) &&
    (["iPad Simulator", "iPad"].includes(navigator?.platform) ||
      (userAgent().includes("mac") && "ontouchend" in document))
  );
}

function detectIOS() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator?.platform) ||
    (userAgent().includes("mac") && "ontouchend" in document)
  );
}

function detectTouch() {
  return "ontouchend" in document;
}

function detectStandaloneMode() {
  // @ts-ignore
  if (window.navigator?.standalone) {
    return true;
  }
  if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)")?.matches) {
    return true;
  }
  return false;
}

function detectAndroid() {
  return userAgent().indexOf("android") !== -1;
}

function detectPlatform() {
  const platform = navigator?.platform ?? window?.navigator?.platform;
  if (platform?.toLowerCase().includes("mac")) {
    return "Mac";
  }
  if (platform?.toLowerCase().includes("win")) {
    return "Windows";
  }
  return platform;
}

function detectBrowser() {
  if (userAgent().indexOf("googlebot") !== -1) {
    return "googlebot";
  }
  if (
    // @ts-ignore
    !!window.chrome &&
    // @ts-ignore
    (!!window.chrome.webstore || navigator.vendor.toLowerCase().indexOf("google inc.") !== -1)
  ) {
    return "chrome";
  }
  if (userAgent().indexOf("safari") !== -1) {
    return "safari";
  }
  // @ts-ignore
  const isIE = /*@cc_on!@*/ false || !!document.documentMode;
  if (isIE) {
    return "ie";
  }

  // @ts-ignore
  if (!isIE && !!window.StyleMedia) {
    return "edge";
  }
  // @ts-ignore
  if (typeof window.InstallTrigger !== "undefined") {
    return "firefox";
  }
  if (
    // @ts-ignore
    (!!window.opr && !!window.opr.addons) ||
    // @ts-ignore
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0
  ) {
    return "opera";
  }
  if (!!window.CSS) {
    return "blink";
  }
  return "unknown";
}
