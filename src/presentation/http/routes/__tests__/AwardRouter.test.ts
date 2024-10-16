import Award from '@domain/award/models/Award'
import sequelize from '@infra/sqlite/SqliteConnection'
import app from '@presentation/App'
import request from 'supertest'

describe('GET /awards/stats', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
    await Award.destroy({ where: {} })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('Should return producers with correct min and max intervals', async () => {
    const response = await request(app).get('/api/v1/awards/stats')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    })
  })
})
