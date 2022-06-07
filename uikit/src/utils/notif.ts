import { toast } from "react-hot-toast";
import { DefaultToastOptions, Renderable, Toast, ToastOptions, ValueOrFunction } from "react-hot-toast/dist/core/types";

declare type Message = ValueOrFunction<Renderable, Toast>;

const notif = {
  show: (msg: Message, opts?: ToastOptions): string => toast(msg, opts),
  custom: (msg: Message, opts?: ToastOptions): string => toast.custom(msg, opts),
  success: (msg: Message, opts?: ToastOptions): string => toast.success(msg, opts),
  error: (msg: Message, opts?: ToastOptions): string => toast.error(msg, opts),
  loading: (msg: Message, opts?: ToastOptions): string => toast.loading(msg, opts),
  dismiss: (toastId?: string | undefined): void => toast.dismiss(toastId),
  remove: (toastId?: string | undefined): void => toast.remove(toastId),
  promise: <T>(
    promise: Promise<T>,
    msgs: {
      loading: Renderable;
      success: ValueOrFunction<Renderable, T>;
      error: ValueOrFunction<Renderable, any>;
    },
    opts?: DefaultToastOptions | undefined
  ): Promise<T> => toast.promise(promise, msgs, opts),
};

export default notif;
