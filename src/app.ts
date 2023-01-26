import * as fastify from 'fastify'
import routers from './router'
import WebSocket from 'ws'
import { join } from 'path'

const multer = require('fastify-multer')

require('dotenv').config({ path: join(__dirname, '../config.conf') })

const app: fastify.FastifyInstance = fastify.fastify({
  logger: { level: 'info' }
})

app.register(multer.contentParser)

app.register(require('fastify-formbody'))
app.register(require('fastify-cors'), {})
// First connection
app.register(require('./plugins/db'), {
  connectionName: 'knex',
  options: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      port: Number(process.env.DB_PORT) || 3306,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
    },
    pool: {
      min: 0,
      max: 100
    },
    debug: true,
  }
})
// Second connection
app.register(require('./plugins/db'), {
  connectionName: 'knex2',
  options: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      port: 3306,
      password: '789124',
      database: 'test2',
    },
    pool: {
      min: 0,
      max: 100
    },
    debug: true,
  }
})

app.register(require('./plugins/jwt'), {
  secret: process.env.SECRET_KEY || '@1234567890@'
})

app.register(require('./plugins/ws'), {
  path: '/ws',
  maxPayload: 1048576,
  verifyClient: function (info: any, next: any) {
    if (info.req.headers['x-fastify-header'] !== 'fastify') {
      return next(false)
    }
    next(true)
  }
})

app.register(require('./plugins/io'), {})

const sockets: any = []

app.ready(err => {
  if (err) throw err

  console.log('Websocket Server started.')

  // middleware
  app.io.use((socket: any, next: any) => {
    let token = socket.handshake.headers['x-fastify-socket-token'];
    console.log(token)
    // if (isValid(token)) {
    return next();
    // }
    // return next(new Error('authentication error'));
  });

  app.io.on('connection', (socket: any) => {
    console.log('user connected')

    socket.username = Math.round(Math.random())
    socket.on('chat message', (message: any) => {
      console.log(message)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  app.ws
    .on('connection', (socket: any) => {
      console.log('Client connected.')

      socket.on('message', (msg: any) => {
        app.ws.clients.forEach((client: any) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(msg)
          }
        })
      }) // Creates an echo server

      socket.on('close', () => console.log('Client disconnected.'))
    })

})

// Axios
app.register(require('fastify-axios'), {
  clients: {
    v1: {
      baseURL: 'https://apingweb.com/api/rest',
    },
    v2: {
      baseURL: 'https://randomuser.me/api'
    }
  }
})

// QR Code
app.register(require('@chonla/fastify-qrcode'))

app.register(routers)

export default app;