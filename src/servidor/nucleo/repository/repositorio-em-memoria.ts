import type { Entidade } from '../model/entidade';
import { paginar, type Paginacao, type Paginado } from '../tipos/paginacao';
import type { Repositorio } from './repositorio';

/**
 * Implementação genérica em memória do Repositorio.
 * Serve para os testes dos casos de uso e para rodar o projeto antes de existir banco.
 *
 * Guarda e devolve CÓPIAS das entidades: alterar um objeto sem chamar `salvar()` não muda
 * o que está gravado, igual a um banco de verdade.
 *
 * A filha só diz como filtrar (`atende`) e, se quiser, a ordem da listagem (`ordenar`).
 */
export abstract class RepositorioEmMemoria<TEntidade extends Entidade<object>, TFiltro extends object = object>
  implements Repositorio<TEntidade, TFiltro>
{
  protected readonly itens = new Map<string, TEntidade>();

  /** O item entra na listagem com este filtro? */
  protected abstract atende(entidade: TEntidade, filtro: TFiltro): boolean;

  /** Ordem da listagem. Padrão: mais antigos primeiro. */
  protected ordenar(a: TEntidade, b: TEntidade): number {
    return a.criadoEm.getTime() - b.criadoEm.getTime();
  }

  async buscarPorId(id: string): Promise<TEntidade | null> {
    return this.itens.get(id)?.clonar() ?? null;
  }

  async listar(filtro: TFiltro, paginacao: Paginacao): Promise<Paginado<TEntidade>> {
    const filtrados = this.todos().filter((item) => this.atende(item, filtro));
    const inicio = (paginacao.pagina - 1) * paginacao.porPagina;
    const pagina = filtrados.slice(inicio, inicio + paginacao.porPagina).map((item) => item.clonar());
    return paginar(pagina, filtrados.length, paginacao);
  }

  async salvar(entidade: TEntidade): Promise<TEntidade> {
    this.itens.set(entidade.id, entidade.clonar());
    return entidade;
  }

  async remover(id: string): Promise<void> {
    this.itens.delete(id);
  }

  async existe(id: string): Promise<boolean> {
    return this.itens.has(id);
  }

  /** Todos os itens gravados, já ordenados. Use nas consultas próprias da filha e devolva `.clonar()`. */
  protected todos(): TEntidade[] {
    return [...this.itens.values()].sort((a, b) => this.ordenar(a, b));
  }

  /** Apaga tudo (útil entre testes). */
  limpar(): void {
    this.itens.clear();
  }
}
