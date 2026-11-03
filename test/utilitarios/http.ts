import type { ManipuladorDeRota } from '@/servidor/nucleo/controller/controlador-base';

const BASE = 'http://localhost/api';

/** Chama um route handler como o Next faria, sem subir servidor. */
export async function chamarRota<TParams extends Record<string, string | string[]>>(
  manipulador: ManipuladorDeRota<TParams>,
  { metodo = 'GET', caminho = '', corpo, params }: { metodo?: string; caminho?: string; corpo?: unknown; params?: TParams } = {},
): Promise<{ status: number; corpo: unknown }> {
  const requisicao = new Request(`${BASE}/${caminho.replace(/^\//, '')}`, {
    method: metodo,
    headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: corpo === undefined ? undefined : typeof corpo === 'string' ? corpo : JSON.stringify(corpo),
  });
  const resposta = await manipulador(requisicao, { params: Promise.resolve((params ?? {}) as TParams) });
  const texto = await resposta.text();
  return { status: resposta.status, corpo: texto ? JSON.parse(texto) : undefined };
}
