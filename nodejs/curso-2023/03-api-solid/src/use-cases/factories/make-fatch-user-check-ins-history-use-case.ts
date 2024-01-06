import { PrismaCheckInsRepository } from '../../repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fatch-user-check-ins-history'

export function makeFatchUserCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInRepository)

  return useCase
}
