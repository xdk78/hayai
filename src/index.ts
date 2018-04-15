import turbo from 'turbo-http'
import Router from 'find-my-way'
import qs from 'querystring'

export default class Hayai {
  router: any
  port: Port
  server: any
  opts?: Options
  mimetype: MimeType

  constructor (opts?: Options) {
    this.router = new Router()
    this.opts = opts
    this.mimetype = 'text/plain'
  }

  get (route: Route, handler: Handler): void {
    this.route('GET', route, handler)
  }

  post (route: Route, handler: Handler): void {
    this.route('POST', route, handler)
  }

  put (route: Route, handler: Handler): void {
    this.route('PUT', route, handler)
  }

  delete (route: Route, handler: Handler): void {
    this.route('DELETE', route, handler)
  }

  options (route: Route, handler: Handler): void {
    this.route('OPTIONS', route, handler)
  }

  route (method: string, path: string, handler: Handler) {
    const reqHandler = (req: Request, res: Response, params: Params) => {
      const reqHeaders = req.getAllHeaders()
      const type = reqHeaders.get('Content-Type')

      res.type = (mime: MimeType) => {
        switch (mime) {
          case 'application/json':
            this.mimetype = 'application/json'
            break
          case 'text/plain':
            this.mimetype = 'text/plain'
            break
          case 'text/html':
            this.mimetype = 'text/html'
            break
          default:
            this.mimetype = 'text/plain'
        }
      }

      res.send = (data: Buffer | any, status: StatusCode, headers: any) => {
        data = data || ''
        data = Buffer.isBuffer(data) ? data : Buffer.from(data)

        res.statusCode = status
        headers = headers || {}
        const keys = Object.keys(headers)
        for (let i = 0; i < keys.length; i++) {
          res.setHeader(keys[i], headers[keys[i]])
        }

        res.setHeader('Content-Length', data.length)
        res.write(data)
      }

      res.json = (json: any, status: StatusCode, headers: any) => {
        const data = JSON.stringify(json)
        headers = headers || {}
        headers['Content-Type'] = headers['Content-Type'] || 'application/json'
        res.send(data, status, headers)
      }

      res.html = (html: any, status: StatusCode, headers: any) => {
        const data = html.toString()
        headers = headers || {}
        headers['Content-Type'] = headers['Content-Type'] || 'text/html'
        res.send(data, status, headers)
      }

      res.end = (data: any, status: StatusCode, headers: any) => {
        switch (this.mimetype) {
          case 'application/json':
            res.json(data, status, headers)
            break
          case 'text/html':
            res.html(data, status, headers)
            break
          default:
            res.send(data, status, headers)
        }
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

  listen (port: Port) {
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
