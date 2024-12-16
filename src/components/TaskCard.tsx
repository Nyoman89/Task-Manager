import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { GripVertical, Pencil, Calendar, MessageSquare, Trash2 } from 'lucide-react';
import TaskEditor from './TaskEditor';
import { useBoardStore } from '../store/boardStore';

interface TaskCardProps {
  task: Task;
  columnId: string;
}

export default function TaskCard({ task, columnId }: TaskCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const { updateTask, deleteTask, currentBoardId } = useBoardStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const handleSave = (updates: Partial<Task>) => {
    if (currentBoardId) {
      updateTask(currentBoardId, columnId, task.id, updates);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (currentBoardId && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(currentBoardId, columnId, task.id);
    }
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <TaskEditor 
          task={task} 
          onSave={handleSave} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#181818] p-4 rounded-lg shadow-lg hover:bg-[#282828] transition-all duration-200 cursor-move group ${
        isDragging ? 'ring-2 ring-[#1DB954] scale-105' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="flex-shrink-0">
          <GripVertical className="w-5 h-5 text-gray-500 group-hover:text-[#1DB954] transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-white">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-gray-400 hover:text-[#1DB954] inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="w-3 h-3 mr-1" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-gray-400 hover:text-red-500 inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </button>
            {task.dueDate && (
              <div className="text-xs inline-flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#1DB954]" />
                <span className={`${
                  new Date(task.dueDate) < new Date() ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {task.comments?.length > 0 && (
              <div className="text-xs inline-flex items-center gap-1 text-gray-400">
                <MessageSquare className="w-3 h-3" />
                {task.comments.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}