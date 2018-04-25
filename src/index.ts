import turbo from 'turbo-http'
import Router from 'find-my-way'
import response from './response'
import request from './request'

export default class Hayai {
  response: (res: Response) => Response
  request: (req: Request, type: any) => Request
  router: any
  port: Port
  server: any
  opts?: Options
  mimetype: MimeType

  constructor (opts?: Options) {
    this.router = new Router()
    this.opts = opts
    this.mimetype = 'text/plain'
    this.response = response
    this.request = request
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

  route (method: string, path: string, handler: Handler): void {
    const reqHandler = (req: Request, res: Response, params: Params) => {
      const reqHeaders = req.getAllHeaders()
      const type = reqHeaders.get('Content-Type')
      handler(this.request(req, type), this.response(res), params)
    }
    this.router.on(method, path, reqHandler)
  }

  listen (port: Port): void {
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

  close (): void {
    this.server.close()
  }
}
