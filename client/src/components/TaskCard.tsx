import type { Task } from '../types/task'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
}

function TaskCard({ task, onClick }: TaskCardProps) {
  const isSubtask = task.parentTaskId !== undefined

  return (
    <button
      type="button"
      onClick={() => onClick(task)}
      className={
        isSubtask
          ? `
            w-[94%] ml-auto
            rounded-xl
            border border-gray-200
            bg-white
            p-3
            text-left
            shadow-sm
            transition
            hover:border-green-300
            hover:shadow
            cursor-pointer
          `
          : `
            w-full
            rounded-xl
            border border-gray-200
            bg-white
            p-4
            text-left
            shadow-sm
            transition
            hover:border-green-400
            hover:shadow-md
            cursor-pointer
          `
      }
    >
      <div className="flex items-start gap-2">
        {isSubtask && (
          <span className="mt-0.5 text-green-600">
            ↳
          </span>
        )}

        <div className="min-w-0">
          <h3
            className={
              isSubtask
                ? 'font-medium text-sm text-gray-700'
                : 'font-semibold text-gray-800'
            }
          >
            {task.title}
          </h3>

          {isSubtask && (
            <p className="text-xs text-gray-400 mt-1">
              Subtask
            </p>
          )}
        </div>
      </div>
    </button>
  )
}

export default TaskCard