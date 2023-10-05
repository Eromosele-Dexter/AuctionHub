import { Injectable, Logger } from '@nestjs/common';
import { Keyword } from '../../entities/keyword.entity';
import { IKeywordRepository } from './keyword.repository.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class KeywordRepository
  extends Repository<Keyword>
  implements IKeywordRepository
{
  private readonly logger = new Logger(KeywordRepository.name);

  constructor(private dataSource: DataSource) {
    super(Keyword, dataSource.createEntityManager());
  }

  async createKeyword(keyword: Keyword): Promise<Keyword> {
    throw new Error('Method not implemented.');
  }
  async getKeywordById(id: number): Promise<Keyword> {
    throw new Error('Method not implemented.');
  }
  async getKeywords(): Promise<Keyword[]> {
    throw new Error('Method not implemented.');
  }
  async updateKeyword(keyword: Keyword): Promise<Keyword> {
    throw new Error('Method not implemented.');
  }
  async deleteKeyword(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
