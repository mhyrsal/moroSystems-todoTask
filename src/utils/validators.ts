import { z } from 'zod';

export const todoSchema = z.object({
    id: z.string(),
    text: z.string().min(1).max(500),
    completed: z.boolean(),
    createdAt: z.string().datetime(),
    completedAt: z.string().datetime().nullable().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    tags: z.array(z.string()).optional(),
});

export const createTodoSchema = z.object({
    text: z.string().min(1, 'Todo text is required').max(500, 'Text too long'),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    tags: z.array(z.string()).optional(),
});

export const updateTodoSchema = z.object({
    text: z.string().min(1).max(500).optional(),
    completed: z.boolean().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    tags: z.array(z.string()).optional(),
});
