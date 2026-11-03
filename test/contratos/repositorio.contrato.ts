import { beforeEach, describe, expect, it } from 'vitest';
import type { Entidade } from '@/servidor/nucleo/model/entidade';
import type { Repositorio } from '@/servidor/nucleo/repository/repositorio';

interface OpcoesDoContrato<TEntidade extends Entidade<object>> {
  /** Cria um repositório vazio para cada teste. */
  criarRepositorio: () => Repositorio<TEntidade> | Promise<Repositorio<TEntidade>>;
  /** Cria uma entidade válida e diferente a cada chamada. */
  criarEntidade: () => TEntidade;
}

/**
 * Testes que TODA implementação de Repositorio deve passar (em memória, Prisma, etc.).
 * Rode no spec de cada repositório:
 *   testarContratoDoRepositorio('BairroRepositoryEmMemoria', { criarRepositorio, criarEntidade });
 * Assim a implementação em memória dos testes e a do banco se comportam igual.
 */
export function testarContratoDoRepositorio<TEntidade extends Entidade<object>>(
  nome: string,
  { criarRepositorio, criarEntidade }: OpcoesDoContrato<TEntidade>,
): void {
  describe(`${nome} (contrato de Repositorio)`, () => {
    let repositorio: Repositorio<TEntidade>;

    beforeEach(async () => {
      repositorio = await criarRepositorio();
    });

    it('salva e busca pelo id', async () => {
      const entidade = criarEntidade();
      await repositorio.salvar(entidade);
      expect((await repositorio.buscarPorId(entidade.id))?.id).toBe(entidade.id);
    });

    it('alterações sem salvar não mudam o que está gravado', async () => {
      const entidade = criarEntidade();
      await repositorio.salvar(entidade);
      const lida = await repositorio.buscarPorId(entidade.id);
      expect(lida).not.toBe(entidade);
      expect(lida).toEqual(entidade);
    });

    it('devolve null para id inexistente', async () => {
      expect(await repositorio.buscarPorId('nao-existe')).toBeNull();
    });

    it('salvar de novo atualiza em vez de duplicar', async () => {
      const entidade = criarEntidade();
      await repositorio.salvar(entidade);
      await repositorio.salvar(entidade);
      expect((await repositorio.listar({}, { pagina: 1, porPagina: 10 })).total).toBe(1);
    });

    it('informa se existe', async () => {
      const entidade = criarEntidade();
      expect(await repositorio.existe(entidade.id)).toBe(false);
      await repositorio.salvar(entidade);
      expect(await repositorio.existe(entidade.id)).toBe(true);
    });

    it('remove', async () => {
      const entidade = criarEntidade();
      await repositorio.salvar(entidade);
      await repositorio.remover(entidade.id);
      expect(await repositorio.buscarPorId(entidade.id)).toBeNull();
    });

    it('pagina a listagem', async () => {
      for (let i = 0; i < 5; i++) await repositorio.salvar(criarEntidade());
      const pagina2 = await repositorio.listar({}, { pagina: 2, porPagina: 2 });
      expect(pagina2).toMatchObject({ total: 5, pagina: 2, porPagina: 2, totalPaginas: 3 });
      expect(pagina2.itens).toHaveLength(2);
    });
  });
}
