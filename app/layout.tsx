'use client';
import React from 'react';
import { CustomThemeProvider } from '../context/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </body>
    </html>
  );
}
