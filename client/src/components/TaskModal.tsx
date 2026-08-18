import { useState } from 'react'
import type {
  AISuggestions,
  AISubtaskSuggestion,
  Task,
} from '../types/task'
import { getAISuggestions } from '../services/aiService'

interface TaskModalProps {
  task: Task
  tasks: Task[]
  onClose: () => void
  onSave: (task: Task, subtasks: Task[]) => void
  onDelete: (taskId: string) => void
  onCreateSubtask: (
    parentTask: Task,
    subtask: AISubtaskSuggestion
  ) => void
  onAddSubtask: (parentTask: Task) => void
}

function TaskModal({
  task,
  tasks,
  onClose,
  onSave,
  onDelete,
  onCreateSubtask,
  onAddSubtask,
}: TaskModalProps) {
  const isSubtask = task.parentTaskId !== undefined

  const [editedTask, setEditedTask] = useState<Task>(task)

  const [editedSubtasks, setEditedSubtasks] =
  useState<Task[]>(() =>
    tasks.filter(
      (currentTask) =>
        currentTask.parentTaskId === task.id
    )
  )

  const [aiSuggestions, setAISuggestions] =
    useState<AISuggestions | null>(null)

  const [isAILoading, setIsAILoading] =
    useState(false)

  const [aiError, setAIError] =
    useState<string | null>(null)

  const [createdSubtasks, setCreatedSubtasks] =
    useState<string[]>([])

  

  async function handleAISuggestions() {
    setIsAILoading(true)
    setAIError(null)

    try {
      const suggestions = await getAISuggestions(editedTask)

      setAISuggestions(suggestions)
    } catch (error) {
      console.error(error)

      setAIError(
        'Unable to generate AI suggestions. Please try again.'
      )
    } finally {
      setIsAILoading(false)
    }
  }

  function handleCreateSubtask(
    subtask: AISubtaskSuggestion
  ) {
    onCreateSubtask(task, subtask)

    setCreatedSubtasks((current) => [
      ...current,
      subtask.title,
    ])
  }

  function handleSave() {
    if (!editedTask.title.trim()) {
      return
    }

    onSave(
      {
        ...editedTask,
        title: editedTask.title.trim(),
      },
      editedSubtasks
    )
  }

  function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (confirmed) {
      onDelete(task.id)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-black">
              {isSubtask ? 'Subtask Details' : 'Task Details'}
            </h2>

            <p className="text-sm text-black mt-1">
              {isSubtask
                ? 'View and edit this subtask.'
                : 'View and edit this task.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer w-9 h-9 rounded-full text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="task-title"
                  className="block text-sm font-semibold mb-2"
                >
                  Title
                </label>

                <input
                  id="task-title"
                  type="text"
                  value={editedTask.title}
                  onChange={(event) =>
                    setEditedTask({
                      ...editedTask,
                      title: event.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="block text-sm font-semibold mb-2"
                >
                  Description
                </label>

                <textarea
                  id="task-description"
                  value={editedTask.description}
                  onChange={(event) =>
                    setEditedTask({
                      ...editedTask,
                      description: event.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 min-h-32 border-gray-300 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                 
                />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label
                htmlFor="task-urgency"
                className="block text-sm font-semibold mb-2"
              >
                Urgency
              </label>

              <select
                id="task-urgency"
                value={editedTask.urgency}
                onChange={(event) =>
                  setEditedTask({
                    ...editedTask,
                    urgency:
                      event.target.value as Task['urgency'],
                  })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-complexity"
                className="block text-sm font-semibold mb-2"
              >
                Complexity
              </label>

              <select
                id="task-complexity"
                value={editedTask.complexity}
                onChange={(event) =>
                  setEditedTask({
                    ...editedTask,
                    complexity:
                      event.target.value as Task['complexity'],
                  })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-date"
                className="block text-sm font-semibold mb-2"
              >
                Target Date
              </label>

              <input
                id="task-date"
                type="date"
                value={editedTask.targetDate}
                onChange={(event) =>
                  setEditedTask({
                    ...editedTask,
                    targetDate: event.target.value,
                  })
                }
                className="cursor-pointer w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <section className="border-t border-gray-100">
              <h3 className="block text-sm font-semibold mb-2">
                Status
              </h3>

              <select
                id="task-column"
                value={editedTask.columnId}
                onChange={(event) =>
                  setEditedTask({
                    ...editedTask,
                    columnId:
                      event.target.value as Task['columnId'],
                  })
                }
                className="cursor-pointer w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">
                  In Progress
                </option>
                <option value="completed">
                  Completed
                </option>
              </select>
            </section>
          </div>
          {!isSubtask && (
              <section className="border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Subtasks
                    </h3>

                    <p className="text-sm text-gray-500">
                      {editedSubtasks.length === 0
                        ? 'No subtasks yet.'
                        : `${editedSubtasks.length} subtask${
                            editedSubtasks.length === 1 ? '' : 's'
                          }`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddSubtask(task)}
                    className="cursor-pointer rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    + Add Subtask
                  </button>
                </div>

                <div className="space-y-2">
                  {editedSubtasks.map((subtask) => (
                    <label
                      key={subtask.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.columnId === 'completed'}
                        onChange={() => {
                          setEditedSubtasks((currentSubtasks) =>
                            currentSubtasks.map((currentSubtask) =>
                              currentSubtask.id === subtask.id
                                ? {
                                    ...currentSubtask,
                                    columnId:
                                      currentSubtask.columnId === 'completed'
                                        ? 'todo'
                                        : 'completed',
                                  }
                                : currentSubtask
                            )
                          )
                        }}
                        className="h-4 w-4 accent-green-600"
                      />

                      <span
                        className={
                          subtask.columnId === 'completed'
                            ? 'text-sm text-gray-400 line-through'
                            : 'text-sm text-gray-700'
                        }
                      >
                        {subtask.title}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

        </div>

        {!isSubtask && (
          <>
            <section className="border-t border-gray-200 bg-gray-50 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    AI Suggestions
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Use AI to improve this task.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAISuggestions}
                  disabled={isAILoading}
                  className="cursor-pointer rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isAILoading
                    ? 'Analysing...'
                    : 'Suggest Improvements'}
                </button>
              </div>
              {aiError && (
                <div className="bg-red-100 rounded-xl border border-gray-200 p-5">
                  <p>{aiError}</p>

                  <button
                    type="button"
                    onClick={handleAISuggestions}
                  >
                    Try Again
                  </button>
                </div>
              )}
              {aiSuggestions && (
                <section className="mt-5">
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h4 className="mb-1 font-bold text-black">Improved Description</h4>

                    <div className="mb-2">
                      {aiSuggestions.suggestedDescription}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setEditedTask((currentTask) => ({
                          ...currentTask,
                          description: aiSuggestions.suggestedDescription,
                        }))
                      }
                      className="cursor-pointer hover:underline"
                    >
                      Apply Description
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h4 className="mb-3 font-bold text-black">Suggested Subtasks</h4>

                    <div className="space-y-4">
                      {aiSuggestions.subtasks.map((subtask, index) => (
                        <div key={index}>
                          <h5 className="mb-1 font-bold">{subtask.title}</h5>

                          <div className="mb-1">{subtask.description}</div>

                          <div className="mb-2">
                            Target date: {subtask.targetDate}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCreateSubtask(subtask)}
                            className="cursor-pointer hover:underline disabled:cursor-default disabled:no-underline"
                            disabled={createdSubtasks.includes(subtask.title)}
                          >
                            {createdSubtasks.includes(subtask.title)
                              ? 'Subtask Created'
                              : 'Create Subtask'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h4 className="font-bold text-black mb-2">
                      AI Complexity Assessment
                    </h4>

                    <div className="flex items-center justify-between gap-4">
                      <span>
                        {aiSuggestions.complexity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setEditedTask((currentTask) => ({
                            ...currentTask,
                            complexity: aiSuggestions.complexity,
                          }))
                        }
                        className="cursor-pointer hover:underline"
                      >
                        Apply Complexity
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </section>
          </>
        )}
        <div className="flex items-center justify-between px-8 py-5 border-t border-gray-100">
          <button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Delete Task
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="cursor-pointer px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskModal