import { ErroDeValidacao } from '../erros/erros';

export interface Paginacao {
  pagina: number;
  porPagina: number;
}

export interface Paginado<T> {
  itens: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

/** Paginação como chega da query string (texto) ou do código (número). */
export interface EntradaPaginacao {
  pagina?: unknown;
  porPagina?: unknown;
}

export const POR_PAGINA_PADRAO = 20;
export const POR_PAGINA_MAXIMO = 100;

/** Converte `pagina`/`porPagina` vindos da query (texto) em números válidos, com valores padrão. */
export function normalizarPaginacao(entrada: EntradaPaginacao = {}): Paginacao {
  const pagina = inteiro(entrada.pagina, 1, 'pagina');
  const porPagina = inteiro(entrada.porPagina, POR_PAGINA_PADRAO, 'porPagina');
  if (pagina < 1) throw new ErroDeValidacao('A página deve ser 1 ou maior.');
  if (porPagina < 1 || porPagina > POR_PAGINA_MAXIMO) {
    throw new ErroDeValidacao(`porPagina deve ficar entre 1 e ${POR_PAGINA_MAXIMO}.`);
  }
  return { pagina, porPagina };
}

/** Monta a resposta paginada. */
export function paginar<T>(itens: T[], total: number, { pagina, porPagina }: Paginacao): Paginado<T> {
  return { itens, total, pagina, porPagina, totalPaginas: Math.max(1, Math.ceil(total / porPagina)) };
}

/** Converte um Paginado de um tipo em outro (ex.: entidade → JSON). */
export function mapearPaginado<T, R>(paginado: Paginado<T>, mapear: (item: T) => R): Paginado<R> {
  return { ...paginado, itens: paginado.itens.map(mapear) };
}

function inteiro(valor: unknown, padrao: number, campo: string): number {
  if (valor === undefined || valor === null || valor === '') return padrao;
  const numero = Number(valor);
  if (!Number.isInteger(numero)) throw new ErroDeValidacao(`${campo} deve ser um número inteiro.`);
  return numero;
}
