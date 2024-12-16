import { create } from 'zustand';
import { Board, Column, Task } from '../types';

interface BoardState {
  boards: Board[];
  currentBoardId: string | null;
  addBoard: (title: string) => void;
  switchBoard: (boardId: string) => void;
  updateBoardTitle: (boardId: string, title: string) => void;
  addTask: (boardId: string, columnId: string, task: Task) => void;
  moveTask: (boardId: string, taskId: string, fromColumnId: string, toColumnId: string) => void;
  updateTask: (boardId: string, columnId: string, taskId: string, updates: Partial<Task>) => void;
  addComment: (boardId: string, taskId: string, comment: Comment) => void;
  addColumn: (boardId: string, title: string) => void;
  deleteTask: (boardId: string, columnId: string, taskId: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  moveColumn: (boardId: string, fromIndex: number, toIndex: number) => void;
  deleteBoard: (boardId: string) => void;
}

const defaultBoard: Board = {
  id: '1',
  title: 'My First Board',
  createdAt: new Date(),
  columns: [{
    id: '1',
    title: 'To Do',
    tasks: [{
      id: 'example-task-1',
      title: 'Example Task',
      description: 'This is an example task with comments and due date',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      comments: []
    }]
  }, {
    id: '2',
    title: 'In Progress',
    tasks: []
  }, {
    id: '3',
    title: 'Done',
    tasks: []
  }],
};

export const useBoardStore = create<BoardState>((set) => ({
  boards: [defaultBoard],
  currentBoardId: defaultBoard.id,
  
  addBoard: (title) =>
    set((state) => ({
      boards: [
        ...state.boards,
        {
          id: Math.random().toString(36).substr(2, 9),
          title,
          createdAt: new Date(),
          columns: [
            { id: '1', title: 'To Do', tasks: [] },
            { id: '2', title: 'In Progress', tasks: [] },
            { id: '3', title: 'Done', tasks: [] },
          ],
        },
      ],
    })),

  switchBoard: (boardId) =>
    set({ currentBoardId: boardId }),

  updateBoardTitle: (boardId, title) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? { ...board, title }
          : board
      ),
    })),

  addTask: (boardId, columnId, task) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? { ...col, tasks: [...col.tasks, task] }
                  : col
              ),
            }
          : board
      ),
    })),

  moveTask: (boardId, taskId, fromColumnId, toColumnId) =>
    set((state) => ({
      boards: state.boards.map((board) => {
        if (board.id !== boardId) return board;

        const fromColumn = board.columns.find((col) => col.id === fromColumnId);
        const toColumn = board.columns.find((col) => col.id === toColumnId);
        
        if (!fromColumn || !toColumn) return board;
        
        const task = fromColumn.tasks.find((t) => t.id === taskId);
        if (!task) return board;

        return {
          ...board,
          columns: board.columns.map((col) => {
            if (col.id === fromColumnId) {
              return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== taskId),
              };
            }
            if (col.id === toColumnId) {
              return {
                ...col,
                tasks: [...col.tasks, task],
              };
            }
            return col;
          }),
        };
      }),
    })),

  updateTask: (boardId, columnId, taskId, updates) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: col.tasks.map((task) =>
                        task.id === taskId
                          ? { ...task, ...updates }
                          : task
                      ),
                    }
                  : col
              ),
            }
          : board
      )
    })),

  addComment: (boardId, taskId, comment) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) => ({
                ...col,
                tasks: col.tasks.map((task) =>
                  task.id === taskId
                    ? {
                        ...task,
                        comments: [...(task.comments || []), comment],
                      }
                    : task
                ),
              })),
            }
          : board
      ),
    })),

  addColumn: (boardId, title) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: [
                ...board.columns,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  title,
                  tasks: [],
                },
              ],
            }
          : board
      ),
    })),

  deleteTask: (boardId, columnId, taskId) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: col.tasks.filter((task) => task.id !== taskId),
                    }
                  : col
              ),
            }
          : board
      ),
    })),

  deleteColumn: (boardId, columnId) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              columns: board.columns.filter((col) => col.id !== columnId),
            }
          : board
      ),
    })),

  moveColumn: (boardId, fromIndex, toIndex) =>
    set((state) => ({
      boards: state.boards.map((board) => {
        if (board.id !== boardId) return board;
        
        const newColumns = [...board.columns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);
        
        return {
          ...board,
          columns: newColumns,
        };
      }),
    })),

  deleteBoard: (boardId) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardId),
      currentBoardId:
        state.currentBoardId === boardId
          ? state.boards.find((b) => b.id !== boardId)?.id || null
          : state.currentBoardId,
    })),
}));