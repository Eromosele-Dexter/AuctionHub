import { Injectable, Logger } from '@nestjs/common';
import { Keyword } from '../../../../../libs/shared-library/src/entities/inventory/keyword.entity';
import { IKeywordRepository } from './keyword.repository.interface';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class KeywordRepository extends Repository<Keyword> implements IKeywordRepository {
  private readonly logger = new Logger(KeywordRepository.name);

  constructor(private dataSource: DataSource) {
    super(Keyword, dataSource.createEntityManager());
  }

  async createKeyword(keyword: Keyword): Promise<Keyword> {
    this.dataSource.manager.create(Keyword, keyword);
    return this.save(keyword);
  }
  async getKeywordByName(name: string): Promise<Keyword> {
    const keyword = await this.dataSource.manager.query('SELECT * FROM keywords WHERE name = $1', [name]);
    return keyword[0];
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
