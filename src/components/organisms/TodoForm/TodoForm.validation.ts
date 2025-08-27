import { z } from 'zod';

export const todoFormSchema = z.object({
    text: z
        .string()
        .min(1, 'Todo text is required')
        .max(500, 'Todo text must be less than 500 characters')
        .trim()
        .refine((text) => text.length > 0 && text.trim().length > 0, 'Todo text cannot be only whitespace'),
    priority: z.enum(['low', 'medium', 'high']).optional().nullable(),
    tags: z.array(z.string().trim()).optional().default([]),
    dueDate: z.string().optional().nullable(),
    description: z.string().max(1000, 'Description too long').optional().nullable(),
});

export type TodoFormData = z.infer<typeof todoFormSchema>;

export const tagSchema = z
    .string()
    .min(1, 'Tag cannot be empty')
    .max(20, 'Tag must be less than 20 characters')
    .trim()
    .regex(/^[a-zA-Z0-9-_]+$/, 'Tag can only contain letters, numbers, hyphens, and underscores');

export const priorityLabels: Record<string, string> = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
};

export const validateTodoForm = (data: unknown) => {
    return todoFormSchema.safeParse(data);
};

export const defaultTodoFormValues: TodoFormData = {
    text: '',
    priority: null,
    tags: [],
    dueDate: null,
    description: null,
};
