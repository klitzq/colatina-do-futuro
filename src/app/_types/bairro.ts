import type { CamposBase } from './comum';

export type Regiao = 'NORTE' | 'SUL' | 'LESTE' | 'OESTE' | 'CENTRO';

interface Bairro extends CamposBase {
  nome: string;
  regiao: Regiao;
  ativo: boolean;
}

export type CriarBairro = Pick<Bairro, 'nome' | 'regiao'>;

export type AtualizarBairro = Partial<Pick<Bairro, 'nome' | 'regiao' | 'ativo'>>;

export interface FiltroBairros {
  regiao?: Regiao;
  ativo?: boolean;
  busca?: string;
}

export default Bairro;
