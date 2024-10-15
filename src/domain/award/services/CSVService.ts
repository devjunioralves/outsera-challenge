import Award from '@domain/award/models/Award'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'
import { injectable } from 'tsyringe'
import { IAward } from '../entities/Award'
import { ICSVService } from '../types/ICSVService'

@injectable()
export class CSVService implements ICSVService {
  constructor(
    private csvFilePath: string = path.join(
      __dirname,
      '../../../data/movielist.csv'
    )
  ) {}

  public async loadCSV(): Promise<void> {
    const awards: IAward[] = []

    return new Promise((resolve, reject) => {
      fs.createReadStream(this.csvFilePath)
        .pipe(csv())
        .on('data', (row: any) => {
          awards.push({
            year: parseInt(row.year),
            title: row.title,
            studios: row.studios,
            producers: row.producers,
            winner: row.winner === 'yes',
          })
        })
        .on('end', async () => {
          await Award.bulkCreate(awards)
          resolve()
        })
        .on('error', (error: any) => reject(error))
    })
  }
}
