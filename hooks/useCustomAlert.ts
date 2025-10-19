import { AlertType } from '@/components/ui/custom-alert';
import { useCallback, useState } from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertState {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  buttons: AlertButton[];
}

export const useCustomAlert = () => {
  const [alert, setAlert] = useState<AlertState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = useCallback(
    (
      title: string,
      message: string,
      buttons: AlertButton[] = [{ text: 'OK', style: 'default' }],
      type: AlertType = 'info'
    ) => {
      setAlert({
        visible: true,
        type,
        title,
        message,
        buttons,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlert(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
};

