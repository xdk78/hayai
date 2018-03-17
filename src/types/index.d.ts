declare module 'turbo-http'
declare module 'find-my-way'

declare interface Response {
  end: Function,
  send: Function,
  statusCode: StatusCode,
  setHeader: Function,
  write: Function,
  json: Function,
  type: Function
  html: Function
}

declare interface Request {
  end: Function,
  getAllHeaders: Function,
  statusCode: StatusCode,
  json: any,
  ondata: Function,
  onend: Function,
  body: any,
  url: string
}

declare type Params = any

declare type Handler = (
  req: Request,
  res: Response,
  params?: object) => void

declare type Port = number | string
declare type StatusCode = number | string
declare type MimeType = string
declare interface ObjectConstructor {
  values(target: any, ...sources: any[]): any;
}

declare type Options = { port?: Port }
declare type Route = string
