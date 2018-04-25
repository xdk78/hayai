import qs from 'querystring'
export default function (req: Request, type): Request {
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
  }
  return req
}
