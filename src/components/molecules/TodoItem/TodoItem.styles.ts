export const todoItemClasses = {
    container: `
    flex items-center gap-3 p-4 
    bg-white dark:bg-gray-800 
    rounded-lg shadow-sm 
    border-l-4 transition-all 
    hover:shadow-md
  `,
    checkbox: `
    w-6 h-6 rounded-full border-2 
    flex items-center justify-center 
    transition-colors duration-200
  `,
    text: `
    flex-1 text-gray-800 dark:text-gray-200
  `,
    completedText: `
    line-through opacity-50
  `,
    actionButton: `
    p-1 transition-colors
  `,
};

export const priorityColors = {
    low: 'border-green-500',
    medium: 'border-yellow-500',
    high: 'border-red-500',
};
