import { describe, expect, it } from 'vitest';
import { ErroDeConflito, ErroDeValidacao } from '@/servidor/nucleo/erros/erros';
import { dadosDeBairro, umBairro } from '@/test/fabricas/bairro.fabrica';
import { esperarErro } from '@/test/utilitarios/erros';
import { BairroRepositoryEmMemoria } from '../bairro.repository';
import { BairroService } from '../bairro.service';
import { CriarBairroCasoDeUso } from './criar-bairro.caso-de-uso';

/**
 * PADRÃO DE TESTE DE CASO DE USO
 * 1. `preparar()` monta o caso de uso com repositório em memória (sem banco, sem mock de framework).
 * 2. Um `describe` por regra de negócio; um `it('deve ...')` por cenário.
 * 3. Corpo em Dado / Quando / Então.
 * 4. Dados vêm das fábricas em test/fabricas; só o campo relevante é sobrescrito.
 */
function preparar() {
  const repositorio = new BairroRepositoryEmMemoria();
  const casoDeUso = new CriarBairroCasoDeUso(repositorio, new BairroService());
  return { repositorio, casoDeUso };
}

describe('CriarBairroCasoDeUso', () => {
  describe('Regra: cria o bairro ativo', () => {
    it('deve gravar o bairro com os dados informados e ativo', async () => {
      // Dado
      const { repositorio, casoDeUso } = preparar();
      const dados = dadosDeBairro({ nome: 'Maria das Graças', regiao: 'NORTE' });

      // Quando
      const bairro = await casoDeUso.executar(dados);

      // Então
      expect(bairro).toMatchObject({ nome: 'Maria das Graças', regiao: 'NORTE', ativo: true });
      expect(await repositorio.buscarPorId(bairro.id)).toEqual(bairro);
    });

    it('deve remover espaços nas pontas do nome', async () => {
      const { casoDeUso } = preparar();

      const bairro = await casoDeUso.executar(dadosDeBairro({ nome: '  Centro  ' }));

      expect(bairro.nome).toBe('Centro');
    });
  });

  describe('Regra: o nome não pode repetir', () => {
    it('deve recusar nome igual, ignorando acentos e maiúsculas', async () => {
      const { repositorio, casoDeUso } = preparar();
      await repositorio.salvar(umBairro({ nome: 'São Silvano' }));

      await esperarErro(() => casoDeUso.executar(dadosDeBairro({ nome: 'sao silvano' })), ErroDeConflito, /Já existe/);
    });
  });

  describe('Regra: dados obrigatórios', () => {
    it.each([
      ['nome vazio', { nome: '' }],
      ['nome curto', { nome: 'Ab' }],
      ['região inválida', { regiao: 'NORDESTE' as never }],
    ])('deve recusar %s', async (_cenario, sobrescrever) => {
      const { repositorio, casoDeUso } = preparar();

      await esperarErro(() => casoDeUso.executar(dadosDeBairro(sobrescrever)), ErroDeValidacao);
      expect((await repositorio.listar({}, { pagina: 1, porPagina: 10 })).total).toBe(0);
    });
  });
});
