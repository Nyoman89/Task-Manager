import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column as ColumnType } from '../types';
import TaskCard from './TaskCard';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

interface ColumnProps {
  column: ColumnType;
  onAddTask: () => void;
  index: number;
}

export default function Column({ column, onAddTask, index }: ColumnProps) {
  const { deleteColumn, currentBoardId } = useBoardStore();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDeleteColumn = () => {
    if (currentBoardId && window.confirm('Are you sure you want to delete this column and all its tasks?')) {
      deleteColumn(currentBoardId, column.id);
    }
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={`w-80 bg-[#282828] rounded-lg p-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="w-5 h-5 text-gray-500 hover:text-[#1DB954]" />
          </div>
          <h2 className="text-lg font-bold text-white">{column.title}</h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onAddTask}
            className="p-1 hover:bg-[#1DB954] rounded-full transition-colors text-white hover:text-black"
            title="Add task"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteColumn}
            className="p-1 hover:bg-red-500 rounded-full transition-colors text-white"
            title="Delete column"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] transition-all duration-200 ${
          isOver ? 'bg-[#1d1d1d] rounded-lg p-3' : ''
        }`}
      >
        <SortableContext
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} columnId={column.id} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}