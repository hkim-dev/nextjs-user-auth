export type ToastType = 'info' | 'success' | 'warning' | 'error';

export type ToastMessage = {
  id: string;
  title: string;
  message: string;
  type: ToastType;
};