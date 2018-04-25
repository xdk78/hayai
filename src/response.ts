export default function (res: Response): Response {
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
  return res
}
