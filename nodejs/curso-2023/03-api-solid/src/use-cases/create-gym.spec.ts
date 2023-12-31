import { it, describe, beforeEach, expect } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('create gym repository', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create new gym', async () => {
    const { gym } = await sut.execute({
      title: 'teste-gym',
      description: '',
      latitude: -28.4499965,
      longitude: -52.2230948,
      phone: '549999999',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
