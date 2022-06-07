import React from "react";
import { Toaster } from "react-hot-toast";
import { DefaultToastOptions, ToastPosition } from "react-hot-toast/dist/core/types";
import { useConfig } from "../hooks/configHooks";
import { mergeProps } from "../utils/deepMerge";

interface NotificationsProps {
  position?: ToastPosition;
  reverseOrder?: boolean;
  containerStyle?: React.CSSProperties;
  toastOptions?: DefaultToastOptions;
}

export default function Notifications(props: NotificationsProps) {
  const config = useConfig();

  const { position, reverseOrder, containerStyle, toastOptions } = mergeProps(config.Notifications, props);

  return (
    <Toaster
      position={position}
      reverseOrder={reverseOrder}
      containerStyle={containerStyle}
      toastOptions={toastOptions}
    />
  );
}
