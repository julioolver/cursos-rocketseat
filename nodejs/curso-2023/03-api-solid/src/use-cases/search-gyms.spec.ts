import { it, describe, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Fetch uiser check-in history use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be to able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      latitude: -28.4499965,
      longitude: -52.2230948,
    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      latitude: -28.4499965,
      longitude: -52.2230948,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  it('should be to able to fatch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        latitude: -28.4499965,
        longitude: -52.2230948,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ])
  })
})
