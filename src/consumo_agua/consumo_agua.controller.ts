import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ConsumoAguaService } from './consumo_agua.service';
import { ConsumoAgua } from './consumo_agua.model';

@Controller('consumo-agua')
export class ConsumoAguaController {
  constructor(private readonly consumoAguaService: ConsumoAguaService) {}

  // Endpoint para registrar o consumo
  @Post('registrar')
  registrarConsumo(@Body() consumo: ConsumoAgua) {
    return this.consumoAguaService.registrarConsumo(consumo);
  }

  // Endpoint para consultar o histórico de consumo em um período
  @Get('historico')
  consultarHistorico(
    @Query('userId') userId: number,
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string
  ) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    return this.consumoAguaService.consultarHistorico(userId, inicio, fim);
  }

  // Endpoint para verificar alertas de consumo elevado
  @Get('alerta/:userId')
  verificarAlerta(@Param('userId') userId: number) {
    return this.consumoAguaService.gerarAlerta(userId);
  }
}
