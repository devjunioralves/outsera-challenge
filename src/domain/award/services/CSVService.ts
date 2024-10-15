import { tokens } from '@di/tokens'
import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'
import { inject, injectable } from 'tsyringe'
import { IAward } from '../entities/Award'
import { IAwardRepository } from '../types/IAwardRepository'
import { ICSVService } from '../types/ICSVService'

@injectable()
export class CSVService implements ICSVService {
  constructor(
    @inject(tokens.AwardRepository)
    private awardRepository: IAwardRepository,
    private csvFilePath: string = path.join(
      __dirname,
      '../../../data/movielist.csv'
    )
  ) {}

  public async loadCSV(): Promise<void> {
    const awards: IAward[] = []

    return new Promise((resolve, reject) => {
      fs.createReadStream(this.csvFilePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row: any) => {
          awards.push({
            year: parseInt(row.year, 10),
            title: row.title,
            studios: row.studios,
            producers: row.producers,
            winner: row.winner === 'yes',
          })
        })
        .on('end', async () => {
          await this.awardRepository.create(awards)
          resolve()
        })
        .on('error', (error: any) => reject(error))
    })
  }
}
