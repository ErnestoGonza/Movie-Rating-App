import React from 'react';
import ThemeProvider from './ThemeProvider';
import AuthProvider from './AuthProvider';

export default function ContextProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
