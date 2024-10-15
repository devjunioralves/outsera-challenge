import { tokens } from '@di/tokens'
import { IAwardService } from '@domain/award/types/IAwardService'
import { IProducerIntervalsResponse } from '@domain/award/types/IProducerIntervalsResponse'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class AwardAppService {
  constructor(
    @inject(tokens.AwardService)
    private awardService: IAwardService
  ) {}
  async findAll(): Promise<IProducerIntervalsResponse> {
    return await this.awardService.findAll()
  }
}
