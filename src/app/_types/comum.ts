/** Data em texto ISO 8601, como chega no JSON da API. */
export type DataISO = string;

/** Campos que toda entidade devolvida pela API tem. */
export interface CamposBase {
  id: string;
  criadoEm: DataISO;
  atualizadoEm: DataISO;
}

export interface Paginacao {
  pagina?: number;
  porPagina?: number;
}

export interface Paginado<T> {
  itens: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

/** Corpo de erro da API (`{ statusCode, message }`). */
export interface ErroApi {
  statusCode: number;
  message: string | string[];
  detalhes?: unknown;
}
