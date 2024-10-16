import Award from '@domain/award/models/Award'
import sequelize from '@infra/sqlite/SqliteConnection'
import app from '@presentation/App'
import request from 'supertest'

describe('GET /awards/stats', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true })
    await Award.destroy({ where: {} })
    const testAwards = [
      {
        year: 1986,
        title: 'Film A',
        studios: 'Studio A',
        producers: 'Producer 1',
        winner: true,
      },
      {
        year: 1987,
        title: 'Film B',
        studios: 'Studio B',
        producers: 'Producer 1',
        winner: true,
      },
      {
        year: 2011,
        title: 'Film C',
        studios: 'Studio C',
        producers: 'Producer 2',
        winner: true,
      },
      {
        year: 2012,
        title: 'Film D',
        studios: 'Studio D',
        producers: 'Producer 2',
        winner: true,
      },
      {
        year: 1980,
        title: 'Film E',
        studios: 'Studio E',
        producers: 'Producer 3',
        winner: true,
      },
      {
        year: 1989,
        title: 'Film F',
        studios: 'Studio F',
        producers: 'Producer 3',
        winner: true,
      },
    ]
    await Award.bulkCreate(testAwards)
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
          producer: 'Producer 1',
          interval: 1,
          previousWin: 1986,
          followingWin: 1987,
        },
        {
          producer: 'Producer 2',
          interval: 1,
          previousWin: 2011,
          followingWin: 2012,
        },
      ],
      max: [
        {
          producer: 'Producer 3',
          interval: 9,
          previousWin: 1980,
          followingWin: 1989,
        },
      ],
    })
  })
})
