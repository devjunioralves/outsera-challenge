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
    const awards: IAwardDataValue[] = await this.awardRepository.findAll()
    return this.calculateProducerIntervals(awards)
  }

  private calculateProducerIntervals(
    awards: IAwardDataValue[]
  ): IProducerIntervalsResponse {
    const producers = awards.map((award) => award.dataValues.producers)
    const uniqueProducers = [...new Set(producers)]

    const intervals: IProducerInterval[] = []

    uniqueProducers.forEach((producer) => {
      const producerAwards = awards.filter(
        (award) => award.dataValues.producers === producer
      )

      if (producerAwards.length < 2) return

      producerAwards.sort((a, b) => a.dataValues.year - b.dataValues.year)

      for (let i = 0; i < producerAwards.length - 1; i++) {
        const previousWin = producerAwards[i].dataValues.year
        const followingWin = producerAwards[i + 1].dataValues.year
        const interval = followingWin - previousWin

        intervals.push({
          producer: producer,
          interval: interval,
          previousWin: previousWin,
          followingWin: followingWin,
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
  }
}
