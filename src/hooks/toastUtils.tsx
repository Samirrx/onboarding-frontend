// utils/toastUtils.tsx
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light'
};

export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, {
      ...defaultOptions,
      ...options
    }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, {
      ...defaultOptions,
      ...options
    }),
  warning: (message: string, options?: ToastOptions) =>
    toast.warn(message, {
      ...defaultOptions,
      ...options
    }),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, {
      ...defaultOptions,
      ...options
    })
};

export const ToastProvider = () => <ToastContainer />;
