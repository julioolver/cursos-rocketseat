import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import crypto, { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

// preHandler é o middeware
export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method} ${request.url}]`)
  })
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req, reply) => {
      const { sessionId } = req.cookies

      const transactions = await knex('trasactions3')
        .where('session_id', sessionId)
        .select('*')

      return {
        transactions,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (req) => {
      const getTransactionsParams = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionsParams.parse(req.params)

      const { sessionId } = req.cookies

      const transaction = await knex('trasactions3')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return {
        transaction,
      }
    },
  )

  app.get(
    '/sumary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const sumary = await knex('trasactions3')
        .sum('amount', {
          as: 'amount',
        })
        .where('session_id', sessionId)
        .first()

      return {
        sumary,
      }
    },
  )

  app.post('/', async (req, res) => {
    const requestBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    const { title, amount, type } = requestBodySchema.parse(req.body)

    let sessionId = req.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      res.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days milesconds
      })
    }

    await knex('trasactions3').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    // 201: criado
    return res.status(201).send()
  })
}
