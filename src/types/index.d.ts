declare module 'turbo-http'
declare module 'find-my-way'

declare interface Response {
  end: any,
  send: any,
  statusCode: STATUSCODE,
  setHeader: any,
  write: any,
  json: any
}

declare interface Request {
  end: any,
  getAllHeaders: any,
  statusCode: STATUSCODE,
  json: any,
  ondata: any,
  onend: any,
  body: any,
  url: string
}

declare type Handler = (
  req: Request,
  res: Response,
  params?: object) => void

declare type PORT = number | string
declare type STATUSCODE = number | string

declare interface ObjectConstructor {
  values(target: any, ...sources: any[]): any;
}
