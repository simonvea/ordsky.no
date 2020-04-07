import { useState } from 'react';

export const useNotification = (
  message: string,
  seconds: number
): [string, () => void] => {
  const [notification, setNotification] = useState('');

  const notify = (): void => {
    setNotification(message);
    setTimeout(() => setNotification(''), seconds * 1000);
  };

  return [notification, notify];
};
