import { Injectable } from '@nestjs/common';
import { ConsumoAgua } from './consumo_agua.model';

@Injectable()
export class ConsumoAguaService {
  private consumos: ConsumoAgua[] = [];

  // Registro de consumo mensal de água
  // Registro de consumo mensal de água
  registrarConsumo(consumo: ConsumoAgua): object {
    // Verifique se a dataLeitura foi fornecida
    if (!consumo.dataLeitura) {
      throw new Error('Data de leitura é obrigatória');
    }

    // Tente converter a dataLeitura para um objeto Date
    const dataLeitura = new Date(consumo.dataLeitura);
    if (isNaN(dataLeitura.getTime())) {
      throw new Error('Data de leitura inválida');
    }

    consumo.id = this.consumos.length + 1;
    consumo.dataLeitura = dataLeitura; // Definindo a data como objeto Date

    this.consumos.push(consumo);

    return {
      message: 'Consumo registrado com sucesso!',
      consumoRegistrado: consumo
    };
  }

  
  

  // Consulta do histórico de consumo em um período especificado
  consultarHistorico(userId: number, dataInicio: Date, dataFim: Date): ConsumoAgua[] {
    return this.consumos.filter(c => 
      c.userId === userId &&
      c.dataLeitura >= dataInicio &&
      c.dataLeitura <= dataFim
    );
  }

  // Geração de alerta para consumo elevado
  gerarAlerta(userId: number): string | null {
    const consumosUsuario = this.consumos.filter(c => c.userId === userId)
      .sort((a, b) => a.dataLeitura.getTime() - b.dataLeitura.getTime());

    if (consumosUsuario.length < 2) {
      return null; // Alerta não gerado: menos de 2 meses registrados
    }

    const ultimoConsumo = consumosUsuario[consumosUsuario.length - 1];
    const penultimoConsumo = consumosUsuario[consumosUsuario.length - 2];

    if (ultimoConsumo.quantidade > penultimoConsumo.quantidade) {
      return `Alerta: Seu consumo de ${ultimoConsumo.quantidade}m³ neste mês é maior que o consumo do mês anterior (${penultimoConsumo.quantidade}m³).`;
    }

    return null; // Sem alerta se o consumo não aumentou
  }
}
