import { IAward } from '@domain/award/entities/Award'
import sequelize from '@infra/sqlite/SqliteConnection'
import { DataTypes, Model } from 'sequelize'

class Award extends Model<IAward> implements IAward {
  public year!: number
  public title!: string
  public studios!: string
  public producers!: string
  public winner!: boolean
}

Award.init(
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studios: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    producers: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    winner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Award',
  }
)

export default Award
