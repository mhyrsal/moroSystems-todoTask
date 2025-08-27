import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { useCreateTodoMutation } from '@features/todos/todosApi';
import { Button } from '@components/atoms/Button';
import { Input } from '@components/atoms/Input';
import { useTranslation } from '@/hooks/useTranslation';

const todoSchema = z.object({
    text: z.string().min(1, 'Todo text is required').max(500, 'Text too long'),
    priority: z.enum(['low', 'medium', 'high']).optional(),
});

type TodoFormData = z.infer<typeof todoSchema>;

export const TodoForm: React.FC = () => {
    const [createTodo, { isLoading }] = useCreateTodoMutation();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TodoFormData>({
        resolver: zodResolver(todoSchema),
    });

    const onSubmit = async (data: TodoFormData) => {
        try {
            await createTodo(data).unwrap();
            reset();
        } catch (error) {
            console.error('Failed to create todo:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 p-4 bg-white rounded-lg shadow-md">
            <div className="flex-1">
                <Input {...register('text')} placeholder={t('addPlaceholder')} error={errors.text?.message} icon={<Plus className="w-5 h-5 text-gray-400" />} />
            </div>

            <select {...register('priority')} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">{t('priority')}</option>
                <option value="low">{t('low')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="high">{t('high')}</option>
            </select>

            <Button type="submit" loading={isLoading} icon={<Plus className="w-5 h-5" />}>
                {t('add')}
            </Button>
        </form>
    );
};
