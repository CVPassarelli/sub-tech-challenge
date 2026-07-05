import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ example: 'b3f1c2a4-1234-4a5b-9c8d-abcdef123456' })
  @IsUUID()
  @IsNotEmpty()
  vehicleId!: string;
}
