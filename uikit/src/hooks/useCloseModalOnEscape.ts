import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function useCloseModalOnEscape(
  modalRef: React.RefObject<HTMLElement>,
  setShow?: React.Dispatch<React.SetStateAction<any>> | (() => void),
  options?: {
    onlyIfForemost?: boolean;
    closeOnEscape?: boolean;
  }
) {
  const { onlyIfForemost = true, closeOnEscape = true } = options ?? {};

  function handleClose() {
    if (!setShow) return;
    if (!closeOnEscape) return;

    if (onlyIfForemost) {
      if (modalRef.current) {
        const allModals = document.querySelectorAll(".modal-wrapper");
        const lastModalInPage = allModals[allModals.length - 1];
        if (lastModalInPage === modalRef.current) {
          setShow(false);
        }
      }
    } else {
      setShow(false);
    }
  }

  useHotkeys("Escape", handleClose, { filter: () => true });
}
