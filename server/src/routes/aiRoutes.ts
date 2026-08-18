import { Router } from 'express'
import { GoogleGenAI } from '@google/genai'
import { aiSuggestionSchema } from '../schemas/aiSuggestionSchema'

const router = Router()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

router.post('/suggestions', async (req, res) => {
  try {
    const { title, description, urgency, targetDate } = req.body

    const prompt = `
      You are an AI assistant helping a user improve a task
      in a project management application.

      Analyse the following task:

      Title: ${title}
      Description: ${description}
      Urgency: ${urgency}
      Target date: ${targetDate}

      Provide:

      1. A clearer and more useful version of the task description.

      2. A list of practical, actionable subtasks.
        Each subtask must have:
        - A concise title
        - A useful description
        - An Urgency rating of Low, Medium, or High based on the target date, default to Low if you lack information
        - A suggested target date
        - A complexity rating of Low, Medium, or High based on the amount of work, technical difficulty, number of steps, and dependencies

      3. A complexity rating of Low, Medium, or High.

      The complexity should consider the amount of work,
      technical difficulty, number of steps, and dependencies.

      Do not change the task's intended goal.

      Subtask target dates should be sensible in relation
      to the main task's target date.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            suggestedDescription: {
              type: 'string',
            },
            subtasks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  urgency: {
                    type: 'string',
                    enum: ['Low', 'Medium', 'High'],
                  },
                  targetDate: {
                    type: 'string',
                  },
                  complexity: {
                    type: 'string',
                    enum: ['Low', 'Medium', 'High'],
                  },
                },
                required: [
                  'title',
                  'description',
                  'urgency',
                  'targetDate',
                  'complexity',
                ],
              },
            },
            complexity: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
            },
          },
          required: [
            'suggestedDescription',
            'subtasks',
            'complexity',
          ],
        },
      },
    })

    const rawResponse = response.text

    if (!rawResponse) {
      return res.status(500).json({
        message: 'Gemini returned an empty response.',
      })
    }

    const parsedResponse = JSON.parse(rawResponse)

    const validationResult =
      aiSuggestionSchema.safeParse(parsedResponse)

    if (!validationResult.success) {
      console.error(
        'Invalid AI response:',
        validationResult.error
      )

      return res.status(502).json({
        message: 'AI returned an invalid response.',
        errors: validationResult.error.issues,
      })
    }

    res.json(validationResult.data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Something went wrong while generating AI suggestions.',
    })
  }
})

export default router