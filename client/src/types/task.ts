export type ColumnId = 'todo' | 'in-progress' | 'completed'

export type Complexity = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  description: string
  urgency: 'low' | 'medium' | 'high'
  targetDate: string
  columnId: ColumnId
  complexity?: Complexity
  parentTaskId?: string
}

export interface AISubtaskSuggestion {
  title: string
  description: string
  urgency: 'low' | 'medium' | 'high'
  targetDate: string
  complexity: Complexity
}

export interface AISuggestions {
  suggestedDescription: string
  subtasks: AISubtaskSuggestion[]
  complexity: Complexity
}