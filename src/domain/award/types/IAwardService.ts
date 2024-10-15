import { IProducerIntervalsResponse } from './IProducerIntervalsResponse'

export interface IAwardService {
  findAll(): Promise<IProducerIntervalsResponse>
}
