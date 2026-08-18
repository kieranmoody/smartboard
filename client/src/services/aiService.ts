import type { AISuggestions, Task } from '../types/task'

export async function getAISuggestions(
  task: Task
): Promise<AISuggestions> {
  const response = await fetch(
    'http://localhost:3000/api/ai/suggestions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        urgency: task.urgency,
        targetDate: task.targetDate,
      }),
    }
  )

  if (!response.ok) {
    throw new Error('Failed to get AI suggestions')
  }

  const data: AISuggestions = await response.json()

  return data
}