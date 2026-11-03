import { CasoDeUso } from '@/servidor/nucleo/application/caso-de-uso';
import type { BairroRepository } from '../bairro.repository';
import type { BairroService } from '../bairro.service';

/** Regra: só remove bairro desativado. */
export class RemoverBairroCasoDeUso extends CasoDeUso<string, void> {
  constructor(
    private readonly repositorio: BairroRepository,
    private readonly service: BairroService,
  ) {
    super();
  }

  protected async processar(id: string): Promise<void> {
    const bairro = this.service.exigirEncontrado(await this.repositorio.buscarPorId(id), 'Bairro não encontrado.');
    this.service.garantirPodeRemover(bairro);
    await this.repositorio.remover(bairro.id);
  }
}
