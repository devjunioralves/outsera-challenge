import { tokens } from '@di/tokens'
import { inject, injectable } from 'tsyringe'
import { IAwardDataValue } from '../types/IAwardDataValue'
import { IAwardRepository } from '../types/IAwardRepository'
import { IAwardService } from '../types/IAwardService'
import { IProducerInterval } from '../types/IProducerInterval'
import { IProducerIntervalsResponse } from '../types/IProducerIntervalsResponse'

@injectable()
export default class AwardService implements IAwardService {
  constructor(
    @inject(tokens.AwardRepository)
    private awardRepository: IAwardRepository
  ) {}

  public async findAll(): Promise<IProducerIntervalsResponse> {
    try {
      const awards: IAwardDataValue[] = await this.awardRepository.findAll()
      return this.calculateProducerIntervals(awards)
    } catch (error) {
      console.error('Error searching awards:', error)
      throw new Error('Error searching awards')
    }
  }

  private calculateProducerIntervals(
    awards: IAwardDataValue[]
  ): IProducerIntervalsResponse {
    try {
      const producerMap: Record<string, number[]> = {}
      awards.forEach((award) => {
        const producers = award.dataValues.producers
          .split(/,|and/)
          .map((producer) => producer.trim())
        const year = award.dataValues.year

        producers.forEach((producer) => {
          if (!producerMap[producer]) {
            producerMap[producer] = []
          }
          producerMap[producer].push(year)
        })
      })

      const intervals: IProducerInterval[] = []
      Object.entries(producerMap).forEach(([producer, years]) => {
        years.sort((a, b) => a - b)

        for (let i = 0; i < years.length - 1; i++) {
          const previousWin = years[i]
          const followingWin = years[i + 1]
          const interval = followingWin - previousWin

          intervals.push({
            producer,
            interval,
            previousWin,
            followingWin,
          })
        }
      })

      const minInterval = Math.min(...intervals.map((i) => i.interval))
      const maxInterval = Math.max(...intervals.map((i) => i.interval))

      const minProducers = intervals.filter((i) => i.interval === minInterval)
      const maxProducers = intervals.filter((i) => i.interval === maxInterval)

      const sortedMinProducers = minProducers
        .sort((a, b) => a.previousWin - b.previousWin)
        .slice(0, 2)
      const sortedMaxProducers = maxProducers
        .sort((a, b) => b.previousWin - a.previousWin)
        .slice(0, 2)

      return {
        min: sortedMinProducers,
        max: sortedMaxProducers,
      }
    } catch (error) {
      console.error('Error calculating producers intervals:', error)
      throw new Error('Error calculating producers intervals')
    }
  }
}
