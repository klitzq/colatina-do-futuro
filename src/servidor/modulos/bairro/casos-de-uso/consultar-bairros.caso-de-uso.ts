import { BuscarPorIdCasoDeUso, ListarCasoDeUso } from '@/servidor/nucleo/application/caso-de-uso';
import type { Bairro } from '../bairro.model';
import type { BairroRepository } from '../bairro.repository';
import type { FiltroBairros } from '../bairro.types';

/** Leituras sem regra própria: herdam os casos de uso genéricos do núcleo. */
export class BuscarBairroCasoDeUso extends BuscarPorIdCasoDeUso<Bairro> {
  protected readonly mensagemNaoEncontrado = 'Bairro não encontrado.';

  constructor(protected readonly repositorio: BairroRepository) {
    super();
  }
}

export class ListarBairrosCasoDeUso extends ListarCasoDeUso<Bairro, FiltroBairros> {
  constructor(protected readonly repositorio: BairroRepository) {
    super();
  }
}
