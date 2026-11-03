import type Bairro from '../_types/bairro';
import type { AtualizarBairro, CriarBairro, FiltroBairros } from '../_types/bairro';
import { ServicoCrud } from './servico-crud';

class BairroService extends ServicoCrud<Bairro, CriarBairro, AtualizarBairro, FiltroBairros> {
  constructor() {
    super('bairros');
  }

  /** Atalho para desativar (exigido antes de remover). */
  desativar(id: string): Promise<Bairro> {
    return this.atualizar(id, { ativo: false });
  }
}

export const bairroService = new BairroService();
