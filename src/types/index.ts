export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt: Date;
}