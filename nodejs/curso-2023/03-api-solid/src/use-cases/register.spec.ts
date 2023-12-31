import { expect, test, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// base da pirâmede dos testes: Unit Testing

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should hash user password apon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johnd1oe@exemple.com',
      password: '123456',
    })

    const isPwdCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isPwdCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@exemple.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    // resolve ou reject

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register user', async () => {
    const email = 'johndoe@exemple.com'

    const { user } = await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
