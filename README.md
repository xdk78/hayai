# [WIP] hayai [![Build Status](https://travis-ci.org/xdk78/hayai.svg?branch=master)](https://travis-ci.org/xdk78/hayai)

    Fast Node.js HTTP framework built on turbo-http

```ts
import Hayai from './index'
const app = new Hayai()
const port: Port = 3000
app.get('/', (req: Request, res: Response, params: Params) => res.send('hello world', 200))
app.get('/json', (req: Request, res: Response, params: Params) => res.json({ hello: 'world' }, 200))
app.get('/html', (req: Request, res: Response, params: Params) => res.html('<b>Hello World</b>', 200))
app.get('/mime', (req: Request, res: Response, params: Params) => {
  res.type('text/html')
  res.end('<b>Hello World</b>', 200)
})
app.listen(port)
```
