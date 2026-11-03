import { describe, expect, it } from 'vitest';
import { testarContratoDoRepositorio } from '@/test/contratos/repositorio.contrato';
import { umBairro, umBairroInativo } from '@/test/fabricas/bairro.fabrica';
import { BairroRepositoryEmMemoria } from './bairro.repository';

// Comportamento comum a todo repositório.
testarContratoDoRepositorio('BairroRepositoryEmMemoria', {
  criarRepositorio: () => new BairroRepositoryEmMemoria(),
  criarEntidade: () => umBairro(),
});

// Consultas próprias do módulo.
describe('BairroRepositoryEmMemoria', () => {
  it('busca por nome ignorando acentos e maiúsculas', async () => {
    const repositorio = new BairroRepositoryEmMemoria();
    const bairro = await repositorio.salvar(umBairro({ nome: 'São Vicente' }));

    expect((await repositorio.buscarPorNome('SAO VICENTE'))?.id).toBe(bairro.id);
  });

  it('filtra por região, situação e busca, em ordem alfabética', async () => {
    const repositorio = new BairroRepositoryEmMemoria();
    await repositorio.salvar(umBairro({ nome: 'Vila Nova', regiao: 'NORTE' }));
    await repositorio.salvar(umBairro({ nome: 'Ayrton Senna', regiao: 'NORTE' }));
    await repositorio.salvar(umBairroInativo({ nome: 'Vila Real', regiao: 'NORTE' }));
    await repositorio.salvar(umBairro({ nome: 'Vila Lenira', regiao: 'SUL' }));

    const resultado = await repositorio.listar({ regiao: 'NORTE', ativo: true }, { pagina: 1, porPagina: 10 });
    expect(resultado.itens.map((b) => b.nome)).toEqual(['Ayrton Senna', 'Vila Nova']);

    const busca = await repositorio.listar({ busca: 'vila' }, { pagina: 1, porPagina: 10 });
    expect(busca.total).toBe(3);
  });
});
