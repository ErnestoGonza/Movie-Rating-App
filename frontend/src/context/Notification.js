import { toast } from 'react-toastify';

export const errorNotification = (error) => {
  const theme = localStorage.getItem('theme');

  toast.error(error, {
    theme: theme === 'light' ? 'dark' : 'light',
    toastId: error,
  });

  toast.update(error, { type: toast.TYPE.ERROR });
};


export const successNotificaiton = (success) => {
  const theme = localStorage.getItem('theme');

  toast.success(success, {
    theme: theme === 'light' ? 'dark' : 'light',
    toastId: success,
  });

  toast.update(success, { type: toast.TYPE.SUCCESS });
};