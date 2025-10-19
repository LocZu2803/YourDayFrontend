import { ToastType } from '@/components/ui/toast';
import { useCallback, useState } from 'react';

interface ToastState {
  visible: boolean;
  type: ToastType;
  message: string;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    type: 'info',
    message: '',
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToast({
      visible: true,
      type,
      message,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};

