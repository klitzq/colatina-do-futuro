import type { Entidade } from '../model/entidade';
import type { Paginacao, Paginado } from '../tipos/paginacao';

/**
 * Contrato de acesso a dados de uma entidade.
 * Os casos de uso dependem desta interface, nunca da implementação,
 * assim o mesmo caso de uso roda com o banco real ou com o repositório em memória dos testes.
 *
 * Cada módulo estende este contrato com as consultas próprias dele
 * (ex.: `buscarPorNome`) e tem duas implementações: em memória e no banco.
 */
export interface Repositorio<TEntidade extends Entidade<object>, TFiltro extends object = object> {
  buscarPorId(id: string): Promise<TEntidade | null>;
  listar(filtro: TFiltro, paginacao: Paginacao): Promise<Paginado<TEntidade>>;
  /** Cria ou atualiza (pelo id). */
  salvar(entidade: TEntidade): Promise<TEntidade>;
  remover(id: string): Promise<void>;
  existe(id: string): Promise<boolean>;
}
