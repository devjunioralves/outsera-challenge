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
    private csvFilePath: string = process.env.CSV_FILE_PATH ||
      path.join(__dirname, '../../../data/movielist.csv')
  ) {}

  public async loadCSV(): Promise<void> {
    try {
      const awards = await this.readCSV()
      await this.awardRepository.create(awards)
    } catch (error) {
      console.error('Error loading CSV:', error)
      throw new Error('Failed to load CSV data')
    }
  }

  private readCSV(): Promise<IAward[]> {
    return new Promise((resolve, reject) => {
      const awards: IAward[] = []
      fs.createReadStream(this.csvFilePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (row: IAward) => {
          const award: IAward | null = this.mapRowToAward(row)
          if (award) awards.push(award)
        })
        .on('end', () => resolve(awards))
        .on('error', (error: any) => {
          console.error('Error reading CSV:', error)
          reject(error)
        })
    })
  }

  private mapRowToAward(row: IAward): IAward | null {
    try {
      return {
        year: parseInt(row.year.toString(), 10),
        title: row.title,
        studios: row.studios,
        producers: row.producers,
        winner: row.winner.toString() === 'yes',
      }
    } catch (error) {
      console.error('Error mapping row to award:', error)
      return null
    }
  }
}
