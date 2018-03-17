const Hayai = require('../dist/index.js')
const app = new Hayai()
const port = 3000
app.get('/', (req, res, params) => res.send('hello world', 200))
app.get('/json', (req, res, params) => res.json({ hello: 'world' }, 200))
app.get('/html', (req, res, params) => res.html('<b>Hello World</b>', 200))
app.get('/mime', (req, res, params) => {
    res.type('text/html')
    res.end('<b>Hello World</b>', 200)
})
app.listen(port)
