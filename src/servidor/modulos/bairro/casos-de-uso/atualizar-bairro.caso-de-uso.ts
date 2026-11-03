import { CasoDeUso } from '@/servidor/nucleo/application/caso-de-uso';
import type { Bairro } from '../bairro.model';
import type { BairroRepository } from '../bairro.repository';
import type { BairroService } from '../bairro.service';
import type { AtualizarBairro } from '../bairro.types';

export interface EntradaAtualizarBairro {
  id: string;
  dados: AtualizarBairro;
}

/** Regra: altera nome, região ou situação; o novo nome não pode ser de outro bairro. */
export class AtualizarBairroCasoDeUso extends CasoDeUso<EntradaAtualizarBairro, Bairro> {
  constructor(
    private readonly repositorio: BairroRepository,
    private readonly service: BairroService,
  ) {
    super();
  }

  protected async processar({ id, dados }: EntradaAtualizarBairro): Promise<Bairro> {
    const bairro = this.service.exigirEncontrado(await this.repositorio.buscarPorId(id), 'Bairro não encontrado.');
    bairro.atualizar(dados);
    this.service.garantirNomeDisponivel(await this.repositorio.buscarPorNome(bairro.nome), bairro.id);
    return this.repositorio.salvar(bairro);
  }
}
