import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SearchRequest {
  /**
   * Limit of the search
   * @example 10
   */
  @ApiProperty({
    description: 'Limit of the search',
    example: 10,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
