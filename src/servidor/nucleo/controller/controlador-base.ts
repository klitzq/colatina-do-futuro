import { ErroDeAplicacao, ErroDeValidacao } from '../erros/erros';
import { Entidade } from '../model/entidade';
import type { ContextoDeExecucao } from '../application/caso-de-uso';

/** Assinatura que o Next espera dos route handlers (`export const GET = ...`). No Next 16, `params` é uma Promise. */
export type ManipuladorDeRota<TParams extends Record<string, string | string[]> = Record<string, never>> = (
  requisicao: Request,
  contexto: { params: Promise<TParams> },
) => Promise<Response>;

/** O que cada ação do controller recebe, já lido da requisição. */
export interface RequisicaoHttp<TParams> {
  requisicao: Request;
  params: TParams;
  /** Query string como objeto (`?pagina=2` → `{ pagina: '2' }`). */
  consulta: Record<string, string>;
  /** Lê o corpo JSON; 400 se não for JSON válido. */
  corpo<T = unknown>(): Promise<T>;
  contexto: ContextoDeExecucao;
}

/** Resposta com status explícito. Se a ação devolver outro valor, ele vira 200 com JSON. */
export class RespostaHttp {
  constructor(
    readonly status: number,
    readonly dados?: unknown,
  ) {}
}

/**
 * Base dos controllers. Fica entre o route handler do Next e os casos de uso:
 * lê a requisição, chama o caso de uso e converte resultado e erros em Response.
 * Não contém regra de negócio.
 *
 * Uso na filha:
 *   listar = this.rota(async ({ consulta }) => this.listarCasoDeUso.executar(...));
 * E no `app/api/.../route.ts`:
 *   export const GET = controlador.listar;
 */
export abstract class ControladorBase {
  /** Embrulha uma ação: monta a RequisicaoHttp e trata erros (padrão Decorator/Wrapper). */
  protected rota<TParams extends Record<string, string | string[]> = Record<string, never>>(
    acao: (entrada: RequisicaoHttp<TParams>) => Promise<unknown>,
  ): ManipuladorDeRota<TParams> {
    return async (requisicao, contextoDaRota) => {
      try {
        const params = (await contextoDaRota?.params) ?? ({} as TParams);
        const resultado = await acao({
          requisicao,
          params,
          consulta: Object.fromEntries(new URL(requisicao.url).searchParams),
          corpo: () => this.lerCorpo(requisicao),
          contexto: await this.contexto(requisicao),
        });
        return this.responder(resultado);
      } catch (erro) {
        return this.tratarErro(erro);
      }
    };
  }

  /**
   * Monta o contexto (usuário logado) a partir da requisição.
   * Sobrescreva quando houver autenticação (ex.: ler o cookie da sessão).
   */
  protected async contexto(_requisicao: Request): Promise<ContextoDeExecucao> {
    return {};
  }

  protected criado(dados: unknown): RespostaHttp {
    return new RespostaHttp(201, dados);
  }

  protected semConteudo(): RespostaHttp {
    return new RespostaHttp(204);
  }

  private async lerCorpo<T>(requisicao: Request): Promise<T> {
    try {
      return (await requisicao.json()) as T;
    } catch {
      throw new ErroDeValidacao('O corpo da requisição deve ser um JSON válido.');
    }
  }

  private responder(resultado: unknown): Response {
    const { status, dados } = resultado instanceof RespostaHttp ? resultado : new RespostaHttp(200, resultado);
    if (status === 204 || dados === undefined) return new Response(null, { status: status === 200 ? 204 : status });
    return Response.json(serializar(dados), { status });
  }

  private tratarErro(erro: unknown): Response {
    if (erro instanceof ErroDeAplicacao) {
      return Response.json({ statusCode: erro.status, message: erro.message, detalhes: erro.detalhes }, { status: erro.status });
    }
    console.error(erro);
    return Response.json({ statusCode: 500, message: 'Erro interno do servidor.' }, { status: 500 });
  }
}

/** Converte entidades (inclusive dentro de listas e Paginado) para JSON. */
export function serializar(valor: unknown): unknown {
  if (valor instanceof Entidade) return valor.paraJSON();
  if (Array.isArray(valor)) return valor.map(serializar);
  if (valor && typeof valor === 'object' && !(valor instanceof Date)) {
    return Object.fromEntries(Object.entries(valor).map(([chave, item]) => [chave, serializar(item)]));
  }
  return valor;
}
