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

      if (!awards || awards.length === 0) {
        throw new Error('No award data available')
      }

      return this.calculateProducerIntervals(awards)
    } catch (error) {
      console.error('Error fetching awards:', error)
      throw new Error('Failed to fetch award data')
    }
  }

  private calculateProducerIntervals(
    awards: IAwardDataValue[]
  ): IProducerIntervalsResponse {
    try {
      const producersMap: Map<string, IAwardDataValue[]> = new Map()

      awards.forEach((award) => {
        const producer = award.dataValues.producers
        if (!producersMap.has(producer)) {
          producersMap.set(producer, [])
        }
        producersMap.get(producer)!.push(award)
      })

      const intervals: IProducerInterval[] = []

      producersMap.forEach((producerAwards, producer) => {
        if (producerAwards.length < 2) return

        producerAwards.sort((a, b) => a.dataValues.year - b.dataValues.year)

        for (let i = 0; i < producerAwards.length - 1; i++) {
          const previousWin = producerAwards[i].dataValues.year
          const followingWin = producerAwards[i + 1].dataValues.year
          const interval = followingWin - previousWin

          intervals.push({
            producer,
            interval,
            previousWin,
            followingWin,
          })
        }
      })

      if (intervals.length === 0) {
        throw new Error('No valid producer intervals found')
      }

      return this.getMinMaxIntervals(intervals)
    } catch (error) {
      console.error('Error calculating producer intervals:', error)
      throw new Error('Failed to calculate producer intervals')
    }
  }

  private getMinMaxIntervals(
    intervals: IProducerInterval[]
  ): IProducerIntervalsResponse {
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
  }
}
