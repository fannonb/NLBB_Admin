import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from '../stores/authStore';
import { ToastContainer } from '../components/Toast';

export const App = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};
