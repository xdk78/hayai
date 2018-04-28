import request from 'supertest'
import Hayai from '../src/index'
const app = new Hayai()
const port = 3000
app.get('/', (req, res, params) => res.send('hello world', 200))
app.get('/json', (req, res, params) => res.json({ hello: 'world' }, 200))
app.get('/html', (req, res, params) => res.html('<b>Hello World</b>', 200))
app.get('/forbidden', (req, res, params) => {
  res.type('text/html')
  res.end('</b>Forbidden!</b>', 403)
})
app.listen(port)

describe('GET /', () => {
  it('respond with hello world', function (done) {
    request('http://localhost:3000')
      .get('/')
      .expect((res) => {
        res.body = 'hello world'
      })
      .expect(200, done)
  })
})

describe('GET /json', () => {
  it('respond with json', (done) => {
    request('http://localhost:3000')
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
  it('respond with html', function (done) {
    request('http://localhost:3000')
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
  it('respond with html and 403 statusCode', function (done) {
    request('http://localhost:3000')
      .get('/forbidden')
      .set('Accept', 'text/html')
      .expect('Content-Type', 'text/html')
      .expect((res) => {
        res.body = '</b>Forbidden!</b>'
      })
      .expect(403, done)
  })
})
