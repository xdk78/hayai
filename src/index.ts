import turbo from 'turbo-http'
import { default as Router } from 'find-my-way'
import qs from 'querystring'

export default class Hayai {
  router: any
  port: PORT
  server: any

  constructor () {
    this.router = new Router()
  }

  get (route: any, handler: Handler): void {
    this.route('GET', route, handler)
  }

  post (route: any, handler: Handler): void {
    this.route('POST', route, handler)
  }

  put (route: any, handler: Handler): void {
    this.route('PUT', route, handler)
  }

  delete (route: any, handler: Handler): void {
    this.route('DELETE', route, handler)
  }

  options (route: any, handler: Handler): void {
    this.route('OPTIONS', route, handler)
  }

  route (method: string, path: string, handler: Handler) {
    const reqHandler = (req: Request, res: Response, params: any) => {
      const reqHeaders = req.getAllHeaders()
      const type = reqHeaders.get('Content-Type')

      res.send = (data: Buffer, status: STATUSCODE, headers: any) => {
        data = data || ''
        data = Buffer.isBuffer(data) ? data : Buffer.from(data)

        res.statusCode = status
        headers = headers || {}

        const keys = Object.keys(headers)
        for (let i = 0; i <= keys.length; i++) {
          res.setHeader(keys[i], headers[keys[i]])
        }

        res.setHeader('content-length', data.length)
        res.write(data)
      }

      res.json = (json: any, status: STATUSCODE, headers: any) => {
        const data = JSON.stringify(json)
        headers = headers || {}
        headers['content-type'] = headers['content-type'] || 'application/json'
        res.send(data, status, headers)
      }

      const bodyarr: any[] = []

      req.ondata = (body: Buffer, start: number, length: number) => {
        const part = body.slice(start, length + start).toString()
        bodyarr.push(part)
      }

      req.onend = () => {
        const b = bodyarr.join('')
        switch (type) {
          case 'application/json':
            const parsedRes = JSON.parse(b)
            req.body = parsedRes.value || parsedRes.err
            break
          case 'application/x-www-form-urlencoded':
            req.body = qs.parse(b)
            break
          case 'text/plain':
          case 'text/html':
          default:
            req.body = b
            break
        }

        handler(req, res, params)
      }
    }
    this.router.on(method, path, reqHandler)
  }

  listen (port: PORT) {
    this.port = port || process.env.PORT || 8080
    this.server = turbo.createServer((req: Request, res: Response) => {
      console.log(req.url)
      this.router.lookup(req, res)
    })
    this.server.listen(port, (err: any) => {
      if (err) throw err
      console.log(`Server listening on: http://localhost:${port}`)
    })
  }

  close () {
    this.server.close()
  }

}
