import TaskCard from './TaskCard'
import type { Task } from '../types/task'

interface ColumnProps {
  title: string
  columnId: Task['columnId']
  tasks: Task[]
  onNewTask: (columnId: Task['columnId']) => void
  onTaskClick: (task: Task) => void
}

function Column({
  title,
  columnId,
  tasks,
  onNewTask,
  onTaskClick,
}: ColumnProps) {
  const columnTasks = tasks.filter(
    (task) => task.columnId === columnId
  )

  return (
    <div className="bg-gray-100 rounded-2xl p-4 min-h-[500px] flex flex-col border border-gray-200">

      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-gray-800">
          {title}
        </h2>

        <span className="text-sm text-gray-500 bg-white px-2.5 py-1 rounded-full">
          {columnTasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onNewTask(columnId)}
        className="mt-auto pt-4 cursor-pointer"
      >
        <span className="block w-full rounded-xl border-2 border-dashed border-gray-300 bg-white py-3 text-sm font-medium text-gray-500 transition hover:border-green-500 hover:text-green-700">
          + New Task
        </span>
      </button>

    </div>
  )
}

export default Column