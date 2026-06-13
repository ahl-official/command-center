'use client';

import { useEffect } from 'react';

export function PWARegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('ServiceWorker registration successful with scope: ', reg.scope);
          })
          .catch((err) => {
            console.error('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  return null;
}
