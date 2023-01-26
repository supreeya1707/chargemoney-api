import fp from 'fastify-plugin'

module.exports = fp(async function (fastify: any, opts: any, done: any) {

  const SocketIOServer = require('socket.io')
  const io = new SocketIOServer(fastify.server, opts);

  fastify.decorate('io', io)
  done()

})