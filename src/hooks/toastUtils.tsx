// utils/toastUtils.tsx
import { toast, ToastContainer, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: 'bottom-center',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored'
};

export const notify = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, {
      ...defaultOptions,
      ...options,
      className: 'custom-toast-success',
      progressClassName: 'custom-progress-success'
    }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, {
      ...defaultOptions,
      ...options,
      className: 'custom-toast-error',
      progressClassName: 'custom-progress-error'
    }),
  warning: (message: string, options?: ToastOptions) =>
    toast.warn(message, {
      ...defaultOptions,
      ...options,
      className: 'custom-toast-warning',
      progressClassName: 'custom-progress-warning'
    }),
  info: (message: string, options?: ToastOptions) =>
    toast.info(message, {
      ...defaultOptions,
      ...options,
      className: 'custom-toast-info',
      progressClassName: 'custom-progress-info'
    })
};

export const ToastProvider = () => <ToastContainer />;
