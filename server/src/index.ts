import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import aiRoutes from './routes/aiRoutes'

const app = express()

const PORT = 3000

app.use(cors())
app.use(express.json())

app.use('/api/ai', aiRoutes)

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'SmartBoard API is running',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})