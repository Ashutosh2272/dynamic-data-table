'use client';
import React, { useState, useMemo } from 'react';
import {
  Table, TableHead, TableBody, TableCell, TableRow, TableSortLabel, TablePagination,
  IconButton, TextField, Button
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store';
import { deleteRow, updateRow } from '../store/tableSlice';
import { RowData } from '../store/tableSlice';

export default function DataTable() {
  const { rows, columns } = useAppSelector(state => state.table);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Inline edit state
  const [editRows, setEditRows] = useState<{ [key: string]: RowData }>({});

  const filteredRows = useMemo(() => {
    let data = [...rows];
    if (search) {
      data = data.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (sortConfig) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [rows, search, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev =>
      prev?.key === key ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }
    );
  };

  const startEdit = (row: RowData) => {
    setEditRows(prev => ({ ...prev, [row.id]: { ...row } }));
  };

  const cancelEdit = (id: string) => {
    setEditRows(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const saveEdit = (id: string) => {
    const row = editRows[id];
    if (row) {
      dispatch(updateRow(row));
      cancelEdit(id);
    }
  };

  const handleChange = (id: string, key: string, value: string) => {
    setEditRows(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: key === 'age' ? Number(value) : value }
    }));
  };

  return (
    <div>
      <input
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 10, padding: 5 }}
      />
      <Table>
        <TableHead>
          <TableRow>
            {columns.filter(c => c.visible).map(col => (
              <TableCell key={col.key}>
                <TableSortLabel
                  active={sortConfig?.key === col.key}
                  direction={sortConfig?.direction || 'asc'}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows.slice(page * 10, page * 10 + 10).map(row => {
            const isEditing = !!editRows[row.id];
            return (
              <TableRow key={row.id}>
                {columns.filter(c => c.visible).map(col => (
                  <TableCell key={col.key}>
                    {isEditing ? (
                      <TextField
                        value={editRows[row.id][col.key]}
                        size="small"
                        onChange={e => handleChange(row.id, col.key, e.target.value)}
                      />
                    ) : (
                      row[col.key]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {isEditing ? (
                    <>
                      <IconButton onClick={() => saveEdit(row.id)}>
                        <Save />
                      </IconButton>
                      <IconButton onClick={() => cancelEdit(row.id)}>
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => startEdit(row)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => dispatch(deleteRow(row.id))}>
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
      />
    </div>
  );
}
