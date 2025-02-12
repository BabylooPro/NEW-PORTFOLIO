import { useState } from "react";

export function TaskManagerDemo() {
    const [tasks, setTasks] = useState<Array<{ id: number, title: string, status: string }>>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [notifications, setNotifications] = useState<string[]>([]);

    const addTask = () => {
        if (newTaskTitle.trim()) {
            const newTask = {
                id: Date.now(),
                title: newTaskTitle,
                status: "TODO"
            };
            setTasks([...tasks, newTask]);
            setNewTaskTitle("");
        }
    };

    const completeTask = (taskId: number) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                const updatedTask = { ...task, status: "COMPLETED" };
                setNotifications([`🎉 Task '${task.title}' has been completed!`, ...notifications]);
                return updatedTask;
            }
            return task;
        }));
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg w-full max-w-md">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New task title"
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-neutral-800 dark:border-neutral-700"
                />
                <button
                    onClick={addTask}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Add Task
                </button>
            </div>

            <div className="space-y-2">
                {tasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-md dark:border-neutral-700">
                        <span className={task.status === "COMPLETED" ? "line-through" : ""}>
                            {task.title}
                        </span>
                        {task.status !== "COMPLETED" && (
                            <button
                                onClick={() => completeTask(task.id)}
                                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                            >
                                Complete
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {notifications.length > 0 && (
                <div className="mt-4 space-y-2">
                    {notifications.map((notification, index) => (
                        <div key={index} className="p-2 bg-green-100 dark:bg-green-900 dark:text-green-100 rounded-md text-sm">
                            {notification}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
