import { ProjectData } from "./types";
import { useState } from "react";

export const softwareEngineering: ProjectData = {
    title: "Software Engineering",
    file: "task_manager.py",
    language: "python",
    terminal: true,
    snippetHeight: 620,
    project: {
        name: "Development/TaskFlow",
        branch: "app"
    },
    terminalCommands: [
        {
            command: 'python -m pytest test_task_manager.py -v',
            output: '============================= test session starts ==============================\nplatform darwin -- Python 3.11.0, pytest-7.4.0\ncollecting ... collected 8 items\n\ntest_task_manager.py::TestTaskManager::test_create_task PASSED     [ 12%]\ntest_task_manager.py::TestTaskManager::test_complete_task PASSED    [ 25%]\ntest_task_manager.py::TestTaskManager::test_get_all_tasks PASSED    [ 37%]\ntest_task_manager.py::TestTaskManager::test_observer_pattern PASSED [ 50%]\ntest_task_manager.py::TestTaskManager::test_task_status PASSED      [ 62%]\ntest_task_manager.py::TestTaskManager::test_task_dates PASSED       [ 75%]\ntest_task_manager.py::TestTaskManager::test_repository PASSED       [ 87%]\ntest_task_manager.py::TestTaskManager::test_notifications PASSED    [100%]\n\n============================== 8 passed in 1.32s ==============================',
            delay: 2500
        },
        {
            command: 'python task_manager.py',
            output: 'Task Manager v1.0.0\nInitializing application...\nLoading configuration...\nStarting GUI...\n\nApplication started successfully!\nListening for events...',
            delay: 1500
        }
    ],
    snippet: `

from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Optional
from datetime import datetime

# TASK STATUS ENUM
class TaskStatus(Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"

# TASK CLASS FOR TASK ENTITY
class Task:
    def __init__(self, title: str, description: str):
        self.id = id(self)
        self.title = title
        self.description = description
        self.status = TaskStatus.TODO
        self.created_at = datetime.now()
        self.completed_at: Optional[datetime] = None

# TASK OBSERVER INTERFACE
class TaskObserver(ABC):
    @abstractmethod
    def update(self, task: Task) -> None:
        pass

# TASK REPOSITORY INTERFACE FOR TASK CRUD OPERATIONS
class TaskRepository(ABC):
    @abstractmethod
    def add(self, task: Task) -> None:
        pass
    
    @abstractmethod
    def get_all(self) -> List[Task]:
        pass
    
    @abstractmethod
    def update(self, task: Task) -> None:
        pass

# IN-MEMORY TASK REPOSITORY FOR TASK CRUD OPERATIONS
class InMemoryTaskRepository(TaskRepository):
    def __init__(self):
        self._tasks: List[Task] = []
    
    def add(self, task: Task) -> None:
        self._tasks.append(task)
    
    def get_all(self) -> List[Task]:
        return self._tasks.copy()
    
    def update(self, task: Task) -> None:
        for i, t in enumerate(self._tasks):
            if t.id == task.id:
                self._tasks[i] = task
                break

# NOTIFICATION SERVICE FOR TASK COMPLETION
class NotificationService(TaskObserver):
    def update(self, task: Task) -> None:
        if task.status == TaskStatus.COMPLETED:
            print(f"🎉 Task '{task.title}' has been completed!")

# TASK MANAGER FOR TASK CRUD OPERATIONS
class TaskManager:
    def __init__(self, repository: TaskRepository):
        self.repository = repository
        self.observers: List[TaskObserver] = []
    
    def add_observer(self, observer: TaskObserver) -> None:
        self.observers.append(observer)
    
    def create_task(self, title: str, description: str) -> Task:
        task = Task(title, description)
        self.repository.add(task)
        return task
    
    def complete_task(self, task: Task) -> None:
        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.now()
        self.repository.update(task)
        
        for observer in self.observers:
            observer.update(task)`,
    preview: {
        type: "component",
        content: TaskManagerDemo
    }
};

function TaskManagerDemo() {
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
