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

export const priorityColors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50',
};

export const validateTodoForm = (data: unknown) => {
    return todoFormSchema.safeParse(data);
};

export const validateTag = (tag: string) => {
    return tagSchema.safeParse(tag);
};

export const validationMessages = {
    required: 'This field is required',
    tooLong: (max: number) => `Must be less than ${max} characters`,
    tooShort: (min: number) => `Must be at least ${min} characters`,
    invalidFormat: 'Invalid format',
    duplicateTag: 'Tag already exists',
    maxTags: (max: number) => `Maximum ${max} tags allowed`,
};

export const defaultTodoFormValues: TodoFormData = {
    text: '',
    priority: null,
    tags: [],
    dueDate: null,
    description: null,
};

export const todoFormRules = {
    text: {
        required: validationMessages.required,
        minLength: {
            value: 1,
            message: validationMessages.tooShort(1),
        },
        maxLength: {
            value: 500,
            message: validationMessages.tooLong(500),
        },
        validate: {
            notEmpty: (value: string) => value.trim().length > 0 || 'Todo text cannot be only whitespace',
        },
    },
    description: {
        maxLength: {
            value: 1000,
            message: validationMessages.tooLong(1000),
        },
    },
};

export const sanitizeTodoFormData = (data: TodoFormData): TodoFormData => {
    return {
        ...data,
        text: data.text.trim(),
        description: data.description?.trim() || null,
        tags: data.tags?.map((tag) => tag.trim()).filter(Boolean) || [],
        priority: data.priority || null,
        dueDate: data.dueDate || null,
    };
};

export const isFormEmpty = (data: TodoFormData): boolean => {
    return !data.text.trim() && !data.priority && (!data.tags || data.tags.length === 0) && !data.dueDate && !data.description?.trim();
};
