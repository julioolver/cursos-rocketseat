import { it, beforeEach, describe, expect } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { InMemoryCheckInRespository } from '../repositories/in-memory/in-memory-check-ins-repository'

let checkInRepository: InMemoryCheckInRespository
let sut: GetUserMetricsUseCase

describe('user metrics use case', async () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRespository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should to be able count check-ins', async () => {
    for (let i = 0; i < 26; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const checkIns = await sut.execute({
      userId: 'user-01',
    })

    expect(checkIns.checkInsCount).toEqual(26)
  })
})
