import { IAward } from '../entities/Award'
import Award from '../models/Award'
import { IAwardDataValue } from '../types/IAwardDataValue'
import { IAwardRepository } from '../types/IAwardRepository'

export default class AwardRepository implements IAwardRepository {
  async findAll(): Promise<IAwardDataValue[]> {
    const awards = await Award.findAll()
    return awards as IAwardDataValue[]
  }

  async create(data: IAward[]): Promise<void> {
    await Award.bulkCreate(data)
  }
}
