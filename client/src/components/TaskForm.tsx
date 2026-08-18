import { useState, type FormEvent } from 'react'
import type { Task } from '../types/task'

interface TaskFormProps {
  columnId: Task['columnId']
  parentTaskId?: string
  isSubtask?: boolean
  onCreateTask: (task: Task) => void
  onClose: () => void
}

function TaskForm({
  columnId,
  parentTaskId,
  isSubtask = false,
  onCreateTask,
  onClose,
}: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] =
    useState<Task['urgency']>('medium')
  const [targetDate, setTargetDate] = useState('')
  const [complexity, setComplexity] =
    useState<Task['complexity']>('Medium')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description,
      urgency,
      complexity,
      targetDate,
      columnId,
      parentTaskId,
    }

    onCreateTask(newTask)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isSubtask ? 'Create Subtask' : 'Create Task'}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {isSubtask
              ? 'Add a task that belongs to this task.'
              : 'Add a new task to your board.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="What needs to be done?"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add some detail..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 min-h-28 resize-y outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="urgency">
                Urgency
              </label>

              <select
                id="urgency"
                value={urgency}
                onChange={(event) =>
                  setUrgency(event.target.value as Task['urgency'])
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="complexity">
                Complexity
              </label>

              <select
                id="complexity"
                value={complexity}
                onChange={(event) =>
                  setComplexity(
                    event.target.value as Task['complexity']
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="targetDate">
              Target date
            </label>

            <input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(event) => setTargetDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button type="submit" className="cursor-pointer px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
              {isSubtask ? 'Create Subtask' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default TaskForm

