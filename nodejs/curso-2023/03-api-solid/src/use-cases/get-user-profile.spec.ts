import { it, describe, beforeEach, expect } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be to able get an user Profile', async () => {
    const { id } = await usersRepository.create({
      email: 'j@j.com',
      name: 'Julio',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: id,
    })

    expect(user.name).toEqual('Julio')
  })

  it('should not be able to get an user Profile', async () => {
    await usersRepository.create({
      email: 'j@j.com',
      name: 'Julio',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        userId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
