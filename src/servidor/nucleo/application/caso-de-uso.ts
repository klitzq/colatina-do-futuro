import { ErroNaoEncontrado } from '../erros/erros';
import type { Entidade } from '../model/entidade';
import type { Repositorio } from '../repository/repositorio';
import { normalizarPaginacao, type EntradaPaginacao, type Paginado } from '../tipos/paginacao';

/** Quem está executando a operação. Preenchido pelo controller a partir da sessão. */
export interface UsuarioAutenticado {
  id: string;
  nome: string;
  perfil: string;
}

export interface ContextoDeExecucao {
  usuario?: UsuarioAutenticado;
}

/**
 * Base de todos os casos de uso (camada application).
 * Um caso de uso = uma regra/ação do negócio (ex.: "criar bairro").
 * Ele orquestra: carrega dados pelo repositório, pede decisões ao service e grava.
 *
 * Padrão Template Method: o controller chama `executar()`, a filha implementa `processar()`.
 * Pontos comuns a todos os casos de uso (log, permissão, transação) entram em `executar()`.
 */
export abstract class CasoDeUso<TEntrada, TSaida> {
  async executar(entrada: TEntrada, contexto: ContextoDeExecucao = {}): Promise<TSaida> {
    return this.processar(entrada, contexto);
  }

  protected abstract processar(entrada: TEntrada, contexto: ContextoDeExecucao): Promise<TSaida>;
}

// ---- Casos de uso genéricos de leitura e remoção. O módulo herda e só informa o repositório e a mensagem. ----

/** Busca por id; 404 se não existir. */
export abstract class BuscarPorIdCasoDeUso<TEntidade extends Entidade<object>> extends CasoDeUso<string, TEntidade> {
  protected abstract readonly repositorio: Repositorio<TEntidade>;
  protected abstract readonly mensagemNaoEncontrado: string;

  protected async processar(id: string): Promise<TEntidade> {
    const entidade = await this.repositorio.buscarPorId(id);
    if (!entidade) throw new ErroNaoEncontrado(this.mensagemNaoEncontrado);
    return entidade;
  }
}

export interface EntradaListagem<TFiltro> {
  filtro?: TFiltro;
  paginacao?: EntradaPaginacao;
}

/** Lista paginada com filtro. */
export abstract class ListarCasoDeUso<TEntidade extends Entidade<object>, TFiltro extends object = object> extends CasoDeUso<
  EntradaListagem<TFiltro>,
  Paginado<TEntidade>
> {
  protected abstract readonly repositorio: Repositorio<TEntidade, TFiltro>;

  protected processar({ filtro, paginacao }: EntradaListagem<TFiltro>): Promise<Paginado<TEntidade>> {
    return this.repositorio.listar((filtro ?? {}) as TFiltro, normalizarPaginacao(paginacao));
  }
}
