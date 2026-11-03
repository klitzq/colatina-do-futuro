import type { Paginacao, Paginado } from '../_types/comum';
import { api } from './api';
import { comQuery } from './query';

/**
 * Base genérica dos services do frontend para recursos REST padrão:
 *   GET /recurso, GET /recurso/:id, POST /recurso, PATCH /recurso/:id, DELETE /recurso/:id
 *
 * Cada módulo herda e acrescenta as chamadas específicas dele:
 *   class BairroService extends ServicoCrud<Bairro, CriarBairro, AtualizarBairro, FiltroBairros> { ... }
 */
export abstract class ServicoCrud<T, TCriar, TAtualizar = Partial<TCriar>, TFiltro extends object = object> {
  protected constructor(protected readonly recurso: string) {}

  listar(filtro?: TFiltro & Paginacao): Promise<Paginado<T>> {
    return api<Paginado<T>>(comQuery(this.recurso, filtro));
  }

  buscar(id: string): Promise<T> {
    return api<T>(`${this.recurso}/${id}`);
  }

  criar(dados: TCriar): Promise<T> {
    return api<T>(this.recurso, { method: 'POST', body: JSON.stringify(dados) });
  }

  atualizar(id: string, dados: TAtualizar): Promise<T> {
    return api<T>(`${this.recurso}/${id}`, { method: 'PATCH', body: JSON.stringify(dados) });
  }

  remover(id: string): Promise<void> {
    return api(`${this.recurso}/${id}`, { method: 'DELETE' });
  }
}
