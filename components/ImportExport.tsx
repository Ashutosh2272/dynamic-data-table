'use client';
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { parseCSV, exportCSV } from '../utils/csvParser';
import { setRows } from '../store/tableSlice';
import { Button } from '@mui/material';

export default function ImportExport() {
  const { rows, columns } = useAppSelector(state => state.table);
  const dispatch = useAppDispatch();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await parseCSV(file);
      dispatch(setRows(data));
    } catch {
      alert('Invalid CSV');
    }
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <input type="file" accept=".csv" onChange={handleImport} />
      <Button onClick={() => exportCSV(rows, columns)} variant="contained" sx={{ ml: 2 }}>
        Export CSV
      </Button>
    </div>
  );
}
