import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckinUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckinUseCase(checkInRepository)

  return useCase
}
