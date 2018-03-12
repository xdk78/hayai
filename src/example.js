const Hayai = require('../dist/index.js')
const app = new Hayai()
const port = 3000
app.get('/', (req, res, params) => res.send('hello world', 200))
app.get('/json', (req, res, params) => res.json({ hello: 'world' }, 200))
app.listen(port)
