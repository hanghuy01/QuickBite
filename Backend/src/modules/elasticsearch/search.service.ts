import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class SearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async indexRestaurant(restaurant: Restaurant) {
    await this.esService.index({
      index: 'restaurants',
      id: restaurant.id.toString(),
      document: restaurant,
    });
  }

  async searchRestaurants(
    q: string,
    category?: string,
    limit = 20,
    offset = 0
  ) {
    const must: any[] = [];

    if (q) {
      must.push({
        bool: {
          should: [
            // full-text match (phân tích từ vựng)
            {
              match: {
                name: {
                  query: q,
                  boost: 3, // ưu tiên field name
                },
              },
            },
            {
              match: {
                description: {
                  query: q,
                },
              },
            },
            // match phrase prefix → hỗ trợ autocomplete
            {
              match_phrase_prefix: {
                name: {
                  query: q,
                  slop: 2, // cho phép lệch tối đa 2 từ
                  boost: 5,
                },
              },
            },
            // fuzzy match để bắt lỗi chính tả
            {
              fuzzy: {
                name: {
                  value: q,
                  fuzziness: 'AUTO',
                },
              },
            },
          ],
        },
      });
    }

    if (category) {
      must.push({
        term: { category: category },
      });
    }

    const result = await this.esService.search({
      index: 'restaurants',
      from: offset,
      size: limit,
      query: {
        bool: {
          must,
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source as Restaurant);
  }
}
