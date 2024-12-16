import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Task, Comment } from '../types';
import { useBoardStore } from '../store/boardStore';

interface TaskCommentsProps {
  task: Task;
}

export default function TaskComments({ task }: TaskCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const { addComment, currentBoardId } = useBoardStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentBoardId) {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        content: newComment.trim(),
        createdAt: new Date(),
        author: 'You', // In a real app, this would come from auth
      };
      addComment(currentBoardId, task.id, comment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[#1DB954]">
        <MessageSquare className="w-4 h-4" />
        <h3 className="text-sm font-medium">Comments</h3>
      </div>
      
      <div className="space-y-2">
        {task.comments?.map((comment) => (
          <div key={comment.id} className="bg-[#181818] p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-[#1DB954]">
                {comment.author}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">{comment.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Add a comment..."
          className="spotify-input text-sm flex-1"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="spotify-button text-sm px-3 py-1"
          disabled={!newComment.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}