// src/modules/elasticsearch/init-elasticsearch.service.ts
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class InitElasticsearchService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InitElasticsearchService.name);

  constructor(
    private readonly esService: ElasticsearchService,
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>
  ) {}

  async onApplicationBootstrap() {
    await this.initIndex();
    await this.indexAllRestaurants();
  }

  private async initIndex() {
    const indexExists = await this.esService.indices.exists({
      index: 'restaurants',
    });
    if (!indexExists) {
      this.logger.log('Creating Elasticsearch index: restaurants');
      await this.esService.indices.create({
        index: 'restaurants',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text' },
              category: { type: 'keyword' },
              description: { type: 'text' },
            },
          },
        },
      });
    } else {
      this.logger.log('Elasticsearch index already exists: restaurants');
    }
  }

  private async indexAllRestaurants() {
    const restaurants = await this.restaurantRepo.find();
    this.logger.log(
      `Indexing ${restaurants.length} restaurants to Elasticsearch`
    );
    for (const r of restaurants) {
      await this.esService.index({
        index: 'restaurants',
        id: r.id.toString(),
        document: r,
      });
    }
    this.logger.log('All restaurants indexed successfully');
  }
}
