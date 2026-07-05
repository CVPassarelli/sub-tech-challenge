import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/presentation/interfaces/authenticated-user.interface';
import { PurchaseVehicleUseCase } from '../application/use-cases/purchase-vehicle.use-case';
import { GetSaleUseCase } from '../application/use-cases/get-sale.use-case';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleResponseDto } from './dto/sale-response.dto';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(
    private readonly purchaseVehicleUseCase: PurchaseVehicleUseCase,
    private readonly getSaleUseCase: GetSaleUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Compra um veículo autenticado' })
  @ApiResponse({ status: 201, type: SaleResponseDto })
  async create(
    @Body() dto: CreateSaleDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<SaleResponseDto> {
    const sale = await this.purchaseVehicleUseCase.execute(dto.vehicleId, user.sub);
    return new SaleResponseDto(sale);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca venda por id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: SaleResponseDto })
  async findById(@Param('id') id: string): Promise<SaleResponseDto> {
    const sale = await this.getSaleUseCase.execute(id);
    return new SaleResponseDto(sale);
  }
}
