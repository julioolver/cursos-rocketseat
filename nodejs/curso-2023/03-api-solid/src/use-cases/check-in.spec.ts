import { it, describe, beforeEach, expect, vi, afterEach } from 'vitest'
import { CheckinUseCase } from './check-in'
import { InMemoryCheckInRespository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOFCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInRepository: InMemoryCheckInRespository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRespository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-id-1',
      title: 'Javascript Gym',
      description: 'a',
      latitude: -28.4499965,
      longitude: -52.2230948,
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be to able to check-in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id-1',
      userLatitude: -28.4499965,
      userLongitude: -52.2230948,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // TODO: estados de teste: red, green, refactory = red causa o erro, green faz funcionar e refactory refatoração
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id-1',
      gymId: 'gym-id-1',
      userLatitude: -28.4499965,
      userLongitude: -52.2230948,
    })

    vi.setSystemTime(new Date(2022, 0, 20, 19, 0, 0))
    await expect(() =>
      sut.execute({
        userId: 'user-id-1',
        gymId: 'gym-id-1',
        userLatitude: -28.4499965,
        userLongitude: -52.2230948,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOFCheckInsError)
  })

  it('should be able to check in twice in diferent days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id-1',
      gymId: 'gym-id-1',
      userLatitude: -28.4499965,
      userLongitude: -52.2230948,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      userId: 'user-id-1',
      gymId: 'gym-id-1',
      userLatitude: -28.4499965,
      userLongitude: -52.2230948,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be to check-in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-id-2',
      title: 'Javascript Gym',
      description: 'a',
      latitude: -28.4417193,
      longitude: -52.1052924,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id-2',
        userLatitude: -28.4499965,
        userLongitude: -52.2230948,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
