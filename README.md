# [WIP] hayai

    Fast Node.js HTTP framework built on turbo-http

```ts
import Hayai from './index'
const app = new Hayai()
const port: PORT = 3000
app.get('/', (req: any, res: Response, params: any) => res.send('hello world', 200))
app.get('/json', (req: any, res: Response, params: any) => res.json({ hello: 'world' }, 200))
app.listen(port)
```