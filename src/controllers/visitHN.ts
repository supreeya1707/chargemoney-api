import {FastifyInstance, FastifyRequest, FastifyReply} from 'fastify'

import {visitHNmodel} from "../models/visitHN";

export default async function visitHN(fastify: FastifyInstance) {

    const searchvn = new visitHNmodel()
    const db: any = fastify.knex

    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const rs: any = await searchvn.getAll(db)
            reply.send({ok: true, message: rs});
        } catch (error) {
            reply.code(500).send({ok: false, error: error.message})
        }
    })

    fastify.get('/',  async (request: FastifyRequest, reply: FastifyReply) => {
        const params: any = request.params;
        const typeid: any = params.typeid;
        try {
            const rs: any = await searchvn.getByType(db, typeid)
            reply.send({ok: true, message: rs});
        } catch (error) {
            reply.code(500).send({ok: false, error: error.message})
        }
    })


    fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
        const body: any = request.body
        let data: any = []
        data = body.data;
        try {
            const rs: any = await searchvn.insRec(db, data)
            reply.send({ok: true, message: rs})
        } catch (error) {
            reply.code(500).send({ok: false, error: error.message})
        }
    })

    fastify.delete('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const params: any = request.params
        const data: any = {}

        data.novel_id = params.id;
        try {
            const rs: any = await searchvn.delRec(db, data)
            reply.send(rs)
        } catch (error) {
            reply.code(500).send({ok: false, error: error.message})
        }
    })


    fastify.put('/:id/cluster_id', async (request: FastifyRequest, reply: FastifyReply) => {
        const body: any = request.body
        const params: any = request.params
        const id = params.id
        let data: any = []
        data = body.data[0];
        try {
            const rs: any = await searchvn.updateRec(db, id, data)
            reply.send({ok: true, message: rs})
        } catch (error) {
            reply.code(500).send({ok: false, error: error.message})
        }
    })


}
