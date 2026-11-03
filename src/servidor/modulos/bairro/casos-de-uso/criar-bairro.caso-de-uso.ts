import { CasoDeUso } from '@/servidor/nucleo/application/caso-de-uso';
import { Bairro } from '../bairro.model';
import type { BairroRepository } from '../bairro.repository';
import type { BairroService } from '../bairro.service';
import type { CriarBairro } from '../bairro.types';

/** Regra: cria um bairro ativo; o nome não pode repetir. */
export class CriarBairroCasoDeUso extends CasoDeUso<CriarBairro, Bairro> {
  constructor(
    private readonly repositorio: BairroRepository,
    private readonly service: BairroService,
  ) {
    super();
  }

  protected async processar(dados: CriarBairro): Promise<Bairro> {
    const bairro = Bairro.criar(dados);
    this.service.garantirNomeDisponivel(await this.repositorio.buscarPorNome(bairro.nome));
    return this.repositorio.salvar(bairro);
  }
}
