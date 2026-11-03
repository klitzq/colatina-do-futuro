export const REGIOES = ['NORTE', 'SUL', 'LESTE', 'OESTE', 'CENTRO'] as const;
export type Regiao = (typeof REGIOES)[number];

/** Campos próprios do bairro (sem id e datas, que vêm da Entidade). */
export interface PropriedadesBairro {
  nome: string;
  regiao: Regiao;
  ativo: boolean;
}

export type CriarBairro = Pick<PropriedadesBairro, 'nome' | 'regiao'>;

export type AtualizarBairro = Partial<PropriedadesBairro>;

export interface FiltroBairros {
  regiao?: Regiao;
  ativo?: boolean;
  /** Parte do nome, sem diferenciar acentos e maiúsculas. */
  busca?: string;
}
