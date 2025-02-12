const code = `from abc import ABC, abstractmethod
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
            observer.update(task)`;

export const snippet = code;
