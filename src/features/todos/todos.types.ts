// Backend Task structure - exactly as returned by the API
export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdDate: number;
    completedDate: number | null;
}

// DTOs for the backend
export interface CreateTaskDto {
    text: string;
}

export interface UpdateTaskDto {
    text: string;
}

// Frontend Todo structure with extra fields
export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    completedAt: string | null;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    starred?: boolean;
}

// Frontend DTOs
export interface CreateTodoDto {
    text: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
}

export interface UpdateTodoDto {
    text?: string;
    completed?: boolean;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    starred?: boolean;
}

// Other types
export interface ApiError {
    message: string;
    statusCode: number;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
