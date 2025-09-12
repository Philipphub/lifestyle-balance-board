import request from 'supertest'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { healthRouter } from '../src/routes/health'

const createTestApp = () => {
  const app = express()

  // Middleware
  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // Routes
  app.use('/api/health', healthRouter)

  // Basic route
  app.get('/', (req, res) => {
    res.json({
      message: 'Lifestyle Balance Board API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    })
  })

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
  })

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' })
  })

  return app
}

describe('Server Routes', () => {
  const app = createTestApp()

  test('GET / should return API info', async () => {
    const response = await request(app).get('/').expect(200)

    expect(response.body).toHaveProperty('message', 'Lifestyle Balance Board API')
    expect(response.body).toHaveProperty('version', '1.0.0')
    expect(response.body).toHaveProperty('timestamp')

    expect(typeof response.body.timestamp).toBe('string')
    const timestamp = new Date(response.body.timestamp)
    expect(timestamp).toBeInstanceOf(Date)
    expect(timestamp.getTime()).not.toBeNaN()
  })

  test('Non-existent routes should return 404', async () => {
    const response = await request(app).get('/non-existent-route').expect(404)

    expect(response.body).toHaveProperty('error', 'Route not found')
  })

  test('API should handle POST requests to non-existent routes', async () => {
    const response = await request(app).post('/some-random-endpoint').expect(404)

    expect(response.body).toHaveProperty('error', 'Route not found')
  })
})
