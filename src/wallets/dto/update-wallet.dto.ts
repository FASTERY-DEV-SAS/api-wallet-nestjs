import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateWalletDto {
  @ApiProperty({
    example: 'My Wallet',
    description: 'The label of the wallet.',
    nullable: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'USD',
    description: 'The currency of the wallet. It can be any currency.',
    nullable: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(12)
  currency: string;

  @ApiProperty({
    example: 'My Wallet is a regular wallet.',
    description: 'The description of the wallet.',
    nullable: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'saving',
    description:
      'The type of the wallet. It can be regular, saving or current.',
    nullable: false,
  })
  @IsString()
  @MinLength(3)
  @IsIn(['regular', 'saving', 'current'])
  @IsOptional()
  type: string;

  @ApiProperty({
    example: false,
    description: 'The status of the wallet.',
    nullable: false,
  })
  @IsOptional()
  isActive: boolean;
}
