import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import { X, Check, Calendar } from 'lucide-react';
import TaskComments from './TaskComments';

interface TaskEditorProps {
  task: Task;
  onSave: (updates: Partial<Task>) => void;
  onCancel: () => void;
}

export default function TaskEditor({ task, onSave, onCancel }: TaskEditorProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState<string>(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#282828] p-4 rounded-lg">
      <div>
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="spotify-input text-sm"
          placeholder="Task title"
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="spotify-input text-sm resize-none"
          placeholder="Add a description..."
          rows={3}
        />
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[#1DB954]" />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="spotify-input text-sm py-1"
        />
      </div>
      <TaskComments task={task} />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="spotify-button-secondary text-sm inline-flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </button>
        <button
          type="submit"
          className="spotify-button text-sm inline-flex items-center"
        >
          <Check className="w-4 h-4 mr-1" />
          Save
        </button>
      </div>
    </form>
  );
}