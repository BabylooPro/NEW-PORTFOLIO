export const terminalCommands = [
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
];
