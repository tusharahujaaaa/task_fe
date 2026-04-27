export interface Task {
    _id?: string;
    title: string;
    description?: string;
    status: 'Todo' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
    dueDate?: string | Date;
    user?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskStats {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    highPriority: number;
}
