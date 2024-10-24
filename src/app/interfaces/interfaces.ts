export interface ToDoList {
    id: number;
    name: string;
    items: ToDoItem[];
    color: string;
}

export interface ToDoItem {
    id?: number;
    todo: string;
    completed: boolean;
    parent_id?: number;
    parent_name?: string;
    parent_color?: string;
}
