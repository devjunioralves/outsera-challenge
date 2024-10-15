import { IAward } from '../entities/Award'
import { IAwardDataValue } from './IAwardDataValue'

export interface IAwardRepository {
  findAll(): Promise<IAwardDataValue[]>
  create(data: IAward[]): Promise<void>
}
