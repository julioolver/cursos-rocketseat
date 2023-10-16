import 'dotenv/config'
import { string, z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3334),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid Environment variables!', _env.error.format())

  throw new Error('Invalid Environment variables.')
}

const env = _env.data

export { env }
