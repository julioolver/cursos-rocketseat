import { expect, test, beforeAll, afterAll } from 'vitest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

test('primeiro teste com vitest', () => {
  // fazer a chamada http para criar uma nov atranação
  // validação (como validar que o teste deu certo)

  const resposeStatusCode = 201

  expect(resposeStatusCode).equals(201)
})
