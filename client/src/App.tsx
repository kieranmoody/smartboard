import { useEffect, useState } from 'react'
import Board from './components/Board'
import TaskForm from './components/TaskForm'
import type {
  AISubtaskSuggestion,
  Task,
} from './types/task'
import TaskModal from './components/TaskModal'

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks =
        localStorage.getItem('smartboard-tasks')

      if (!savedTasks) {
        return []
      }

      return JSON.parse(savedTasks)
    } catch (error) {
      console.error(
        'Unable to load saved tasks:',
        error
      )

      return []
    }
  })

  const [taskFormColumn, setTaskFormColumn] =
    useState<Task['columnId'] | null>(null)
    useEffect(() => {
      localStorage.setItem(
        'smartboard-tasks',
        JSON.stringify(tasks)
      )
    }, [tasks])
  
  const [subtaskParent, setSubtaskParent] =
    useState<Task | null>(null)

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null)
    useEffect(() => {
      localStorage.setItem(
        'smartboard-tasks',
        JSON.stringify(tasks)
      )
    }, [tasks])

  function handleAddSubtask(parentTask: Task) {
    setSubtaskParent(parentTask)
  }

  function handleNewTask(columnId: Task['columnId']) {
    setTaskFormColumn(columnId)
  }

  function handleCreateTask(task: Task) {
    setTasks((currentTasks) => [
      ...currentTasks,
      task,
    ])

    setTaskFormColumn(null)
    setSubtaskParent(null)
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task)
  }

  function handleCreateSubtask(
    parentTask: Task,
    subtask: AISubtaskSuggestion
  ) {
    const newSubtask: Task = {
      id: crypto.randomUUID(),
      title: subtask.title,
      description: subtask.description,
      urgency: 'medium',
      targetDate: subtask.targetDate,
      columnId: parentTask.columnId,
      parentTaskId: parentTask.id,
    }

    setTasks((currentTasks) => [
      ...currentTasks,
      newSubtask,
    ])
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-200">
      <Board
        tasks={tasks}
        onNewTask={handleNewTask}
        onTaskClick={handleTaskClick}
      />

      {taskFormColumn && (
        <TaskForm
          columnId={taskFormColumn}
          onCreateTask={handleCreateTask}
          onClose={() => setTaskFormColumn(null)}
        />
      )}
      {subtaskParent && (
        <TaskForm
          columnId={subtaskParent.columnId}
          parentTaskId={subtaskParent.id}
          isSubtask={true}
          onCreateTask={handleCreateTask}
          onClose={() => setSubtaskParent(null)}
        />
      )}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          tasks={tasks}
          onClose={() => setSelectedTask(null)}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
          onCreateSubtask={handleCreateSubtask}
          onAddSubtask={setSubtaskParent}
        />
      )}
      
    </main>
  )
function handleUpdateTask(
  updatedTask: Task,
  updatedSubtasks: Task[]
) {
  setTasks((currentTasks) =>
    currentTasks.map((task) => {
      if (task.id === updatedTask.id) {
        return updatedTask
      }

      const updatedSubtask = updatedSubtasks.find(
        (subtask) => subtask.id === task.id
      )

      return updatedSubtask ?? task
    })
  )

  setSelectedTask(null)
}

function handleDeleteTask(taskId: string) {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.id !== taskId)
  )

  setSelectedTask(null)
}
}



export default App