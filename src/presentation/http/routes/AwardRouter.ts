import { Router } from 'express'

import BaseController from '@shared/http/controller/BaseController'
import BaseRouter from '@shared/http/controller/BaseRouter'

import { tokens } from '@di/tokens'
import { inject, injectable } from 'tsyringe'

import { IRouter } from './IRouter'

@injectable()
export class AwardRouter extends BaseRouter implements IRouter {
  constructor(
    @inject(tokens.ListAwardStatsController)
    private listAwardStatsController: BaseController
  ) {
    super(Router())
  }

  setup(): Router {
    this.get('/v1/awards/stats', this.listAwardStatsController)
    return this.getRouter()
  }
}
