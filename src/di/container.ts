import { tokens } from '@di/tokens'
import { Routes } from '@presentation/http/Routes'
import { container } from 'tsyringe'

const childContainer = container.createChildContainer()

childContainer.registerSingleton(tokens.Routes, Routes)

import AwardAppService from '@application/award/AwardAppService'
import AwardRepository from '@domain/award/infra/AwardRepository'
import AwardService from '@domain/award/services/AwardService'
import ListAwardStatsController from '@presentation/http/controllers/award/ListAwardStatsController'
import { AwardRouter } from '@presentation/http/routes/AwardRouter'

childContainer.registerSingleton(tokens.AwardRouter, AwardRouter)
childContainer.registerSingleton(
  tokens.ListAwardStatsController,
  ListAwardStatsController
)
childContainer.registerSingleton(tokens.AwardAppService, AwardAppService)
childContainer.registerSingleton(tokens.AwardService, AwardService)
childContainer.registerSingleton(tokens.AwardRepository, AwardRepository)

export { childContainer as container }
