import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { InitElasticsearchService } from './init-elasticsearch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200', // server v8
      maxRetries: 5,
      requestTimeout: 60000,
      pingTimeout: 3000,
      // Nếu cần auth thì thêm
      // auth: {
      //   username: 'elastic',
      //   password: 'changeme',
      // },
    }),
    TypeOrmModule.forFeature([Restaurant]),
  ],
  providers: [SearchService, InitElasticsearchService],
  exports: [SearchService],
})
export class ElasticModule {}
