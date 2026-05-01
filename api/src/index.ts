import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import modelsRouter from './routes/models'
import configRouter from './routes/config'

const app = express()

app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})
app.use('/api/models', modelsRouter)
app.use('/api/config', configRouter)


const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`API listening on ${PORT}`))
