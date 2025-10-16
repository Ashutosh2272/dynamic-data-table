'use client';
import React from 'react';
import DataTable from '../components/DataTable';
import ColumnManager from '../components/ColumnManager';
import ImportExport from '../components/ImportExport';
import { Provider } from 'react-redux';
import { store, persistor } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { Container, Button } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';

export default function Page() {
  const { toggleTheme, mode } = useThemeContext();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Container sx={{ mt: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Dynamic Data Table Manager</h1>
            <Button variant="contained" onClick={toggleTheme}>
              {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
          </div>
          <ImportExport />
          <ColumnManager />
          <DataTable />
        </Container>
      </PersistGate>
    </Provider>
  );
}
