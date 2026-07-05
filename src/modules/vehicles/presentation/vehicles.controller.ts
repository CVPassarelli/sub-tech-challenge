import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.use-case';
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.use-case';
import { GetVehicleUseCase } from '../application/use-cases/get-vehicle.use-case';
import { ListAvailableVehiclesUseCase } from '../application/use-cases/list-available-vehicles.use-case';
import { ListSoldVehiclesUseCase } from '../application/use-cases/list-sold-vehicles.use-case';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleResponseDto } from './dto/vehicle-response.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly getVehicleUseCase: GetVehicleUseCase,
    private readonly listAvailableVehiclesUseCase: ListAvailableVehiclesUseCase,
    private readonly listSoldVehiclesUseCase: ListSoldVehiclesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastra um veículo para venda' })
  @ApiResponse({ status: 201, type: VehicleResponseDto })
  async create(@Body() dto: CreateVehicleDto): Promise<VehicleResponseDto> {
    const vehicle = await this.createVehicleUseCase.execute(dto);
    return new VehicleResponseDto(vehicle);
  }

  @Get('available')
  @ApiOperation({ summary: 'Lista veículos disponíveis ordenados por preço crescente' })
  @ApiResponse({ status: 200, type: [VehicleResponseDto] })
  async listAvailable(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.listAvailableVehiclesUseCase.execute();
    return vehicles.map((vehicle) => new VehicleResponseDto(vehicle));
  }

  @Get('sold')
  @ApiOperation({ summary: 'Lista veículos vendidos ordenados por preço crescente' })
  @ApiResponse({ status: 200, type: [VehicleResponseDto] })
  async listSold(): Promise<VehicleResponseDto[]> {
    const vehicles = await this.listSoldVehiclesUseCase.execute();
    return vehicles.map((vehicle) => new VehicleResponseDto(vehicle));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca veículo por id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async findById(@Param('id') id: string): Promise<VehicleResponseDto> {
    const vehicle = await this.getVehicleUseCase.execute(id);
    return new VehicleResponseDto(vehicle);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edita os dados de um veículo' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: VehicleResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.updateVehicleUseCase.execute(id, dto);
    return new VehicleResponseDto(vehicle);
  }
}
