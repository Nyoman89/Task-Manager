import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Layout, Plus } from 'lucide-react';
import Column from './components/Column';
import BoardSelector from './components/BoardSelector';
import { useBoardStore } from './store/boardStore';

function App() {
  const { boards, currentBoardId, moveTask, moveColumn, addTask, addColumn } = useBoardStore();
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const currentBoard = boards.find(board => board.id === currentBoardId);
  if (!currentBoard) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging a column
    if (active.data.current?.type === 'Column') {
      const oldIndex = currentBoard.columns.findIndex(col => col.id === activeId);
      const newIndex = currentBoard.columns.findIndex(col => col.id === overId);
      
      if (oldIndex !== newIndex) {
        moveColumn(currentBoard.id, oldIndex, newIndex);
      }
    } else {
      // Handle task movement
      const taskId = active.id as string;
      const fromColumnId = currentBoard.columns.find(col => 
        col.tasks.some(task => task.id === taskId)
      )?.id;
      const toColumnId = overId;

      if (fromColumnId) {
        moveTask(currentBoard.id, taskId, fromColumnId, toColumnId);
      }
    }
  };

  const handleAddTask = (columnId: string) => {
    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Task',
      description: 'Click to edit',
      createdAt: new Date(),
    };
    addTask(currentBoard.id, columnId, newTask);
  };

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      addColumn(currentBoard.id, newColumnTitle);
      setNewColumnTitle('');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <header className="bg-[#282828] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center mr-8">
              <Layout className="w-6 h-6 text-[#1DB954]" />
              <h1 className="ml-2 text-xl font-bold text-white">Boards</h1>
            </div>
            <BoardSelector />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <form onSubmit={handleAddColumn} className="flex gap-2">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="New column title"
              className="spotify-input text-sm"
            />
            <button
              type="submit"
              className="spotify-button text-sm inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Column
            </button>
          </form>
        </div>

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 items-start">
            <SortableContext
              items={currentBoard.columns.map(col => col.id)}
              strategy={horizontalListSortingStrategy}
            >
              {currentBoard.columns.map((column, index) => (
                <Column
                  key={column.id}
                  column={column}
                  onAddTask={() => handleAddTask(column.id)}
                  index={index}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </main>
    </div>
  );
}

export default App;