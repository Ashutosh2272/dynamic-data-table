'use client';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { RowData, Column } from '../store/tableSlice';

export function parseCSV(file: File): Promise<RowData[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data as RowData[]),
      error: err => reject(err),
    });
  });
}

export function exportCSV(rows: RowData[], columns: Column[]) {
  const visibleCols = columns.filter(c => c.visible).map(c => c.key);
  const dataToExport = rows.map(r => {
    const obj: any = {};
    visibleCols.forEach(col => (obj[col] = r[col]));
    return obj;
  });
  const csv = Papa.unparse(dataToExport);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'table_export.csv');
}
