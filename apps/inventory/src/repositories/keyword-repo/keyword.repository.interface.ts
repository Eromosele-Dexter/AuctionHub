import { Keyword } from '../../entities/keyword.entity';

export interface IKeywordRepository {
  createKeyword(keyword: Keyword): Promise<Keyword>;
  getKeywordById(id: number): Promise<Keyword>;
  getKeywords(): Promise<Keyword[]>;
  updateKeyword(keyword: Keyword): Promise<Keyword>;
  deleteKeyword(id: number): Promise<void>;
}
