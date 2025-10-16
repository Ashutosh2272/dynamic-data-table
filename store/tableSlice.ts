import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface RowData {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
}

export interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface TableState {
  rows: RowData[];
  columns: Column[];
}

const initialState: TableState = {
  rows: [],
  columns: [
    { key: 'name', label: 'Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'role', label: 'Role', visible: true },
  ],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<RowData[]>) {
      state.rows = action.payload.map(r => ({ ...r, id: r.id || uuidv4() }));
    },
    updateRow(state, action: PayloadAction<RowData>) {
      const index = state.rows.findIndex(r => r.id === action.payload.id);
      if (index !== -1) state.rows[index] = action.payload;
    },
    deleteRow(state, action: PayloadAction<string>) {
      state.rows = state.rows.filter(r => r.id !== action.payload);
    },
    addColumn(state, action: PayloadAction<Column>) {
      state.columns.push(action.payload);
    },
    toggleColumnVisibility(state, action: PayloadAction<string>) {
      const col = state.columns.find(c => c.key === action.payload);
      if (col) col.visible = !col.visible;
    },
  },
});

export const { setRows, updateRow, deleteRow, addColumn, toggleColumnVisibility } = tableSlice.actions;
export default tableSlice.reducer;
