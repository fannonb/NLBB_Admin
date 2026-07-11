import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const BootPage = () => {
  const navigate = useNavigate();
  const isReady = useAuthStore((state) => state.isReady);

  useEffect(() => {
    if (isReady) {
      navigate('/', { replace: true });
    }
  }, [isReady, navigate]);

  return (
    <div className="boot-screen">
      <div className="boot-card">
        <h1>NLBB</h1>
        <p>Preparing your workspace...</p>
      </div>
    </div>
  );
};
