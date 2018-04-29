import request from 'supertest'
import Hayai from '../src/index'

const app = new Hayai()
const port = process.env.PORT || 3000

beforeAll(() => {
  app.post('/', (req, res, params) => {
    res.type('application/json')
    res.end(req.body, 200)
  })
  app.listen(port)
})

describe('POST /', () => {
  it('request with hello world', (done) => {
    request(`http://localhost:${port}`)
      .post('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .send({ hello: 'world' })
      .expect((res) => {
        res.body = { hello: 'world' }
      })
      .expect(200, done)
  })
})

afterAll(() => {
  app.close()
})
