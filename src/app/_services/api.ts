import type { ErroApi } from '../_types/comum';

/** As rotas da API ficam no próprio Next (src/app/api). */
const PREFIXO_API = '/api';

/** Erro das chamadas à API, com o status HTTP e a mensagem vinda do backend. */
export class ErroApiRequisicao extends Error {
  constructor(
    public readonly status: number,
    mensagem: string,
    public readonly detalhes: ErroApi | null = null,
  ) {
    super(mensagem);
    this.name = 'ErroApiRequisicao';
  }
}

async function lerCorpo(res: Response): Promise<unknown> {
  const texto = await res.text();
  if (!texto) return undefined;
  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

function mensagemDoErro(corpo: unknown, status: number): string {
  const erro = corpo as Partial<ErroApi> | undefined;
  if (Array.isArray(erro?.message)) return erro.message.join(' ');
  if (typeof erro?.message === 'string') return erro.message;
  return status >= 500 ? 'Erro no servidor. Tente novamente em instantes.' : `Erro ${status} na requisição.`;
}

/**
 * Chama a API do projeto.
 * @param caminho rota sem barra inicial (ex.: 'bairros?regiao=NORTE')
 * @param init opções do fetch; objetos em `body` devem ir já em JSON.stringify
 * @returns o JSON da resposta; `undefined` em respostas 204
 * @throws ErroApiRequisicao com status e mensagem do backend
 */
export async function api<T = void>(caminho: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const res = await fetch(`${PREFIXO_API}/${caminho.replace(/^\//, '')}`, { ...init, headers });
  const corpo = await lerCorpo(res);
  if (!res.ok) throw new ErroApiRequisicao(res.status, mensagemDoErro(corpo, res.status), (corpo as ErroApi) ?? null);
  return corpo as T;
}
