import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
})

export default sequelize
