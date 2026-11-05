import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'

const port = Number(process.env.API_PORT ?? 3001)
let balance = 2840.5
const activity = [
  { id: 'tx-1', recipient: 'Amina Yusuf', phone: '+234 803 442 1180', amount: 48, direction: 'sent', status: 'completed', createdAt: '2026-11-05T09:41:00Z' },
  { id: 'tx-2', recipient: 'Daniel Okafor', phone: '+234 812 771 9024', amount: 125, direction: 'received', status: 'completed', createdAt: '2026-11-05T08:18:00Z' },
  { id: 'tx-3', recipient: "Mama's Kitchen", phone: '+234 809 315 6042', amount: 16.5, direction: 'sent', status: 'pending', createdAt: '2026-11-04T17:32:00Z' },
  { id: 'tx-4', recipient: 'Chidi Nwosu', phone: '+234 706 098 4221', amount: 32, direction: 'received', status: 'completed', createdAt: '2026-11-04T12:06:00Z' },
]

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  response.end(JSON.stringify(payload))
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 16_384) {
        reject(new Error('Request body is too large.'))
        request.destroy()
      }
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Request body must be valid JSON.'))
      }
    })
    request.on('error', reject)
  })
}

function getSummary() {
  return { balance, currency: 'USDT', network: 'Demo network' }
}

const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)

  if (request.method === 'GET' && pathname === '/api/health') {
    sendJson(response, 200, { status: 'ok', mode: 'demo' })
    return
  }

  if (request.method === 'GET' && pathname === '/api/summary') {
    sendJson(response, 200, getSummary())
    return
  }

  if (request.method === 'GET' && pathname === '/api/activity') {
    sendJson(response, 200, activity)
    return
  }

  if (request.method === 'POST' && pathname === '/api/transfers') {
    let input
    try {
      input = await readJson(request)
    } catch (error) {
      if (!response.destroyed) sendJson(response, 400, { error: error.message })
      return
    }

    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      sendJson(response, 400, { error: 'Request body must be a JSON object.' })
      return
    }

    const recipient = typeof input.recipient === 'string' ? input.recipient.trim() : ''
    const phone = typeof input.phone === 'string' ? input.phone.trim() : ''
    const amount = Number(input.amount)

    if (recipient.length < 2 || recipient.length > 70) {
      sendJson(response, 400, { error: 'Enter a recipient name between 2 and 70 characters.' })
      return
    }
    if (!/^[+()\d\s.-]{7,24}$/.test(phone)) {
      sendJson(response, 400, { error: 'Enter a valid mobile number.' })
      return
    }
    if (!Number.isFinite(amount) || amount <= 0 || Number(amount.toFixed(2)) !== amount) {
      sendJson(response, 400, { error: 'Enter an amount with up to two decimal places.' })
      return
    }
    if (amount > balance) {
      sendJson(response, 400, { error: 'Amount is greater than your available demo balance.' })
      return
    }

    const transfer = {
      id: randomUUID(),
      recipient,
      phone,
      amount,
      direction: 'sent',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
    balance = Number((balance - amount).toFixed(2))
    activity.unshift(transfer)
    sendJson(response, 201, { transfer, summary: getSummary(), simulated: true })
    return
  }

  sendJson(response, 404, { error: 'Endpoint not found.' })
})

server.listen(port, '127.0.0.1', () => {
  console.log(`LightPay demo API listening on http://127.0.0.1:${port}`)
})