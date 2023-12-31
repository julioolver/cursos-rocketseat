import { it, describe, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be to able to FetchNearby for gyms', async () => {
    await gymsRepository.create({
      title: 'near Gym',
      latitude: -28.4499965,
      longitude: -52.2230948,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -27.4499965,
      longitude: -49.6230948,
    })

    const { gyms } = await sut.execute({
      userLatitude: -28.4499965,
      userLongitude: -52.2230948,
    })

    expect(gyms).toHaveLength(1)
  })
})
