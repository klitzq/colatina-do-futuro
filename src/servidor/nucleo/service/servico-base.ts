import { ErroNaoEncontrado, type ErroDeAplicacao } from '../erros/erros';
import { garantir } from '../validacao/regras';

/**
 * Base dos services de domínio: regras de negócio puras, sem acesso a banco nem HTTP.
 * Recebem dados já carregados pelo caso de uso e decidem (validam, calculam, lançam erro).
 * Por não terem I/O, são testados diretamente, sem dublês.
 */
export abstract class ServicoBase {
  /** Lança `erro` quando a condição é falsa. */
  protected garantir(condicao: unknown, erro: ErroDeAplicacao): asserts condicao {
    garantir(condicao, erro);
  }

  /** Devolve o valor ou lança 404 com a mensagem informada. */
  exigirEncontrado<T>(valor: T | null | undefined, mensagem: string): T {
    if (valor === null || valor === undefined) throw new ErroNaoEncontrado(mensagem);
    return valor;
  }
}
