export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    completedAt?: string | null;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    starred?: boolean;
    dueDate?: string | null;
    description?: string;
}

export interface CreateTodoDto {
    text: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    starred?: boolean;
    dueDate?: string | null;
    description?: string;
}

export interface UpdateTodoDto {
    text?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    starred?: boolean;
    dueDate?: string | null;
    description?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
