import Column from './Column'
import type { Task } from '../types/task'

interface BoardProps {
  tasks: Task[]
  onNewTask: (columnId: Task['columnId']) => void
  onTaskClick: (task: Task) => void
}

function Board({ tasks, onNewTask, onTaskClick }: BoardProps) {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column
          title="To Do"
          columnId="todo"
          tasks={tasks}
          onNewTask={onNewTask}
          onTaskClick={onTaskClick}
        />

        <Column
          title="In Progress"
          columnId="in-progress"
          tasks={tasks}
          onNewTask={onNewTask}
          onTaskClick={onTaskClick}
        />

        <Column
          title="Completed"
          columnId="completed"
          tasks={tasks}
          onNewTask={onNewTask}
          onTaskClick={onTaskClick}
        />
      </div>
    </div>
  )
}

export default Board