import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

// base da pirâmede dos testes: Unit Testing
let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Auth Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    const email = 'johndoe@exemple.com'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to authenticate whit wrong e-mail', async () => {
    const email = 'johndoe@exemple.com'

    expect(() =>
      sut.execute({
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
  it('should not be able to authenticate whit wrong pwd', async () => {
    const email = 'johndoe@exemple.com'

    await usersRepository.create({
      name: 'John Doe',
      email,
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email,
        password: '1232456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
