import React, { useState } from 'react';
import { Plus, Pencil, Check, X, Trash2 } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

export default function BoardSelector() {
  const { boards, currentBoardId, addBoard, switchBoard, updateBoardTitle, deleteBoard } = useBoardStore();
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      addBoard(newBoardTitle.trim());
      setNewBoardTitle('');
      setIsCreating(false);
    }
  };

  const handleEditSubmit = (boardId: string) => {
    if (editTitle.trim()) {
      updateBoardTitle(boardId, editTitle.trim());
      setEditingBoardId(null);
      setEditTitle('');
    }
  };

  const startEditing = (board: { id: string; title: string }) => {
    setEditingBoardId(board.id);
    setEditTitle(board.title);
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board and all its contents?')) {
      deleteBoard(boardId);
    }
  };

  return (
    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
      <div className="flex space-x-2">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`group relative flex items-center min-w-[120px] h-8 px-4 rounded-full transition-colors ${
              board.id === currentBoardId
                ? 'bg-[#1DB954] text-black font-semibold'
                : 'bg-[#282828] text-white hover:bg-[#383838]'
            }`}
          >
            {editingBoardId === board.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditSubmit(board.id);
                }}
                className="flex items-center w-full"
              >
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-1 hover:text-[#1DB954]"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setEditingBoardId(null)}
                  className="p-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </form>
            ) : (
              <>
                <button
                  onClick={() => switchBoard(board.id)}
                  className="flex-1 text-sm text-left truncate"
                >
                  {board.title}
                </button>
                <button
                  onClick={() => startEditing(board)}
                  className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                    board.id === currentBoardId ? 'text-black' : 'text-white'
                  }`}
                  title="Edit board"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  className={`ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ${
                    board.id === currentBoardId ? 'text-black' : 'text-white'
                  }`}
                  title="Delete board"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {isCreating ? (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 min-w-[250px]">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Board title"
            className="spotify-input text-sm flex-1"
            autoFocus
          />
          <button type="submit" className="spotify-button text-sm px-3 py-1">
            <Check className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="spotify-button-secondary text-sm px-3 py-1"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="spotify-button text-sm inline-flex items-center min-w-[120px] justify-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Board
        </button>
      )}
    </div>
  );
}