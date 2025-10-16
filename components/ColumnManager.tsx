'use client';
import React, { useState } from 'react';
import { Modal, Box, FormGroup, FormControlLabel, Checkbox, Button, TextField } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store';
import { toggleColumnVisibility, addColumn } from '../store/tableSlice';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export default function ColumnManager() {
  const { columns } = useAppSelector(state => state.table);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [newCol, setNewCol] = useState('');
  const [colOrder, setColOrder] = useState(columns.map(c => c.key));

  const handleAddColumn = () => {
    if (newCol.trim()) {
      dispatch(addColumn({ key: newCol.toLowerCase(), label: newCol, visible: true }));
      setNewCol('');
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(colOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setColOrder(newOrder);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Manage Columns</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ bgcolor: 'white', p: 4, margin: '10% auto', width: 300 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="columns">
              {(provided) => (
                <FormGroup {...provided.droppableProps} ref={provided.innerRef}>
                  {colOrder.map((key, index) => {
                    const col = columns.find(c => c.key === key)!;
                    return (
                      <Draggable key={col.key} draggableId={col.key} index={index}>
                        {(provided) => (
                          <FormControlLabel
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            control={
                              <Checkbox
                                checked={col.visible}
                                onChange={() => dispatch(toggleColumnVisibility(col.key))}
                              />
                            }
                            label={col.label}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </FormGroup>
              )}
            </Droppable>
          </DragDropContext>
          <TextField
            label="New Column"
            value={newCol}
            onChange={e => setNewCol(e.target.value)}
            size="small"
            sx={{ mt: 2 }}
          />
          <Button onClick={handleAddColumn} sx={{ mt: 1 }} variant="contained">
            Add Column
          </Button>
        </Box>
      </Modal>
    </>
  );
}
