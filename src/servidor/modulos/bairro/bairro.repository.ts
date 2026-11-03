import type { Repositorio } from '@/servidor/nucleo/repository/repositorio';
import { RepositorioEmMemoria } from '@/servidor/nucleo/repository/repositorio-em-memoria';
import { normalizarTexto } from '@/servidor/nucleo/validacao/regras';
import type { Bairro } from './bairro.model';
import type { FiltroBairros } from './bairro.types';

/** Contrato do repositório de bairros: o genérico mais as consultas próprias do módulo. */
export interface BairroRepository extends Repositorio<Bairro, FiltroBairros> {
  buscarPorNome(nome: string): Promise<Bairro | null>;
}

/** Implementação em memória (testes e desenvolvimento sem banco). */
export class BairroRepositoryEmMemoria extends RepositorioEmMemoria<Bairro, FiltroBairros> implements BairroRepository {
  async buscarPorNome(nome: string): Promise<Bairro | null> {
    const procurado = normalizarTexto(nome);
    return this.todos().find((bairro) => normalizarTexto(bairro.nome) === procurado)?.clonar() ?? null;
  }

  protected atende(bairro: Bairro, filtro: FiltroBairros): boolean {
    if (filtro.regiao && bairro.regiao !== filtro.regiao) return false;
    if (filtro.ativo !== undefined && bairro.ativo !== filtro.ativo) return false;
    if (filtro.busca && !normalizarTexto(bairro.nome).includes(normalizarTexto(filtro.busca))) return false;
    return true;
  }

  protected ordenar(a: Bairro, b: Bairro): number {
    return a.nome.localeCompare(b.nome, 'pt-BR');
  }
}
