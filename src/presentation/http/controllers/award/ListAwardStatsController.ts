import { inject, injectable } from 'tsyringe'

import BaseController from '@shared/http/controller/BaseController'

import AwardAppService from '@application/award/AwardAppService'
import { tokens } from '@di/tokens'
import { IRequest } from '@presentation/http/types/IRequest'
import { BaseError } from '@shared/exceptions/BaseError'

@injectable()
export default class ListAwardStatsController extends BaseController {
  constructor(
    @inject(tokens.AwardAppService)
    private awardAppService: AwardAppService
  ) {
    super()
  }

  public async execute(request: IRequest) {
    try {
      const result = await this.awardAppService.findAll()

      return this.send(result)
    } catch (err) {
      return this.error(err as BaseError)
    }
  }
}
