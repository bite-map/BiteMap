import { Bounce, toast } from "react-toastify";

export const createToast = (
  message: string,
  type: string = "success",
  autoClose: number = 5000
) => {
  if (type === "info") {
    return () =>
      toast.info(message, {
        position: "bottom-center",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
  }

  if (type === "success") {
    return () =>
      toast.success(message, {
        position: "bottom-center",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
  }

  if (type === "error") {
    return () =>
      toast.error(message, {
        position: "bottom-center",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
  }

  if (type === "warn") {
    return () =>
      toast.warn(message, {
        position: "bottom-center",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
  }
};
