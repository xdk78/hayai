import request from 'supertest'
import Hayai from '../src/index'

const app = new Hayai()
const port = process.env.PORT || 3000 || 5000

beforeAll(() => {
  app.get('/', (req, res, params) => res.send('hello world', 200))
  app.get('/json', (req, res, params) => res.json({ hello: 'world' }, 200))
  app.get('/html', (req, res, params) => res.html('<b>Hello World</b>', 200))
  app.get('/forbidden', (req, res, params) => {
    res.type('text/html')
    res.end('</b>Forbidden!</b>', 403)
  })
  app.get('/query', (req, res, params) => {
    res.type('application/json')
    res.end(params, 200)
  })
  app.listen(port)
})

describe('GET /', () => {
  it('respond with hello world', (done) => {
    request(`http://localhost:${port}`)
      .get('/')
      .expect((res) => {
        res.body = 'hello world'
      })
      .expect(200, done)
  })
})

describe('GET /json', () => {
  it('respond with json', (done) => {
    request(`http://localhost:${port}`)
      .get('/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .expect((res) => {
        res.body.hello = 'world'
      })
      .expect(200, done)
  })
})

describe('GET /html', () => {
  it('respond with html', (done) => {
    request(`http://localhost:${port}`)
      .get('/html')
      .set('Accept', 'text/html')
      .expect('Content-Type', 'text/html')
      .expect((res) => {
        res.body = '<b>Hello World</b>'
      })
      .expect(200, done)
  })
})

describe('GET /forbidden', () => {
  it('respond with html and 403 statusCode', (done) => {
    request(`http://localhost:${port}`)
      .get('/forbidden')
      .set('Accept', 'text/html')
      .expect('Content-Type', 'text/html')
      .expect((res) => {
        res.body = '</b>Forbidden!</b>'
      })
      .expect(403, done)
  })
})

describe('GET /query?hello=world', () => {
  it('respond with json and query', (done) => {
    request(`http://localhost:${port}`)
      .get('/query')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .query({ hello: 'world' })
      .expect((res) => {
        res.body = { hello: 'world' }
      })
      .expect(200, done)
  })
})

afterAll(() => {
  app.close()
})
