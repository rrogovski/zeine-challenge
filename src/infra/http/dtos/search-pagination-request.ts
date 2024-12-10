import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { SearchRequest } from './search-request';

export class SearchPaginationRequest extends SearchRequest {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  page: number;
}
