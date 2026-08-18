import { z } from 'zod'

export const aiSuggestionSchema = z.object({
  suggestedDescription: z.string().min(1),

  subtasks: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      urgency: z.string().min(1),
      targetDate: z.string().min(1),
      complexity: z.string().min(1),
    })
  ),

  complexity: z.enum(['Low', 'Medium', 'High']),
})

export type AISuggestion = z.infer<typeof aiSuggestionSchema>