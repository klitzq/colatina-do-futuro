import { ErroDeConflito, ErroDeRegraDeNegocio } from '@/servidor/nucleo/erros/erros';
import { ServicoBase } from '@/servidor/nucleo/service/servico-base';
import type { Bairro } from './bairro.model';

/** Regras de negócio do bairro. Sem I/O: recebe o que o caso de uso já buscou. */
export class BairroService extends ServicoBase {
  /** Não pode haver dois bairros com o mesmo nome (ignorando acentos e maiúsculas). */
  garantirNomeDisponivel(existente: Bairro | null, idAtual?: string): void {
    this.garantir(!existente || existente.id === idAtual, new ErroDeConflito('Já existe um bairro com esse nome.'));
  }

  /** Só bairros desativados podem ser removidos. */
  garantirPodeRemover(bairro: Bairro): void {
    this.garantir(!bairro.ativo, new ErroDeRegraDeNegocio('Desative o bairro antes de removê-lo.'));
  }
}
