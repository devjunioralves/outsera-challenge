import { container } from '@di/container'
import { tokens } from '@di/tokens'
import { CSVService } from '@domain/award/services/CSVService'
import sequelize from '@infra/sqlite/SqliteConnection'
import bodyParser from 'body-parser'
import express, { Router } from 'express'
import { Routes } from './http/Routes'

const router = Router()
const routes = container.resolve<Routes>(tokens.Routes)
routes.setupRouter(router)

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)
;(async () => {
  try {
    await sequelize.sync({
      force: true,
      logging: false,
    })
    const csvService = container.resolve(CSVService)
    await csvService.loadCSV()
  } catch (error) {
    console.error('Error during startup:', error)
  }
})()

export default app
