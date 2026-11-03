import { describe, expect, it } from 'vitest';
import { ErroDeConflito, ErroNaoEncontrado } from '@/servidor/nucleo/erros/erros';
import { umBairro } from '@/test/fabricas/bairro.fabrica';
import { esperarErro } from '@/test/utilitarios/erros';
import { BairroRepositoryEmMemoria } from '../bairro.repository';
import { BairroService } from '../bairro.service';
import { AtualizarBairroCasoDeUso } from './atualizar-bairro.caso-de-uso';

function preparar() {
  const repositorio = new BairroRepositoryEmMemoria();
  const casoDeUso = new AtualizarBairroCasoDeUso(repositorio, new BairroService());
  return { repositorio, casoDeUso };
}

describe('AtualizarBairroCasoDeUso', () => {
  describe('Regra: altera nome, região ou situação', () => {
    it('deve aplicar a alteração parcial e manter os outros campos', async () => {
      // Dado
      const { repositorio, casoDeUso } = preparar();
      const bairro = await repositorio.salvar(umBairro({ nome: 'Vila Lenira', regiao: 'SUL' }));

      // Quando
      const atualizado = await casoDeUso.executar({ id: bairro.id, dados: { regiao: 'OESTE' } });

      // Então
      expect(atualizado).toMatchObject({ nome: 'Vila Lenira', regiao: 'OESTE', ativo: true });
    });

    it('deve permitir salvar o próprio nome sem acusar conflito', async () => {
      const { repositorio, casoDeUso } = preparar();
      const bairro = await repositorio.salvar(umBairro({ nome: 'Esplanada' }));

      const atualizado = await casoDeUso.executar({ id: bairro.id, dados: { nome: 'ESPLANADA' } });

      expect(atualizado.nome).toBe('ESPLANADA');
    });
  });

  describe('Regra: o novo nome não pode ser de outro bairro', () => {
    it('deve recusar com conflito', async () => {
      const { repositorio, casoDeUso } = preparar();
      await repositorio.salvar(umBairro({ nome: 'Santa Mônica' }));
      const outro = await repositorio.salvar(umBairro({ nome: 'Colúmbia' }));

      await esperarErro(() => casoDeUso.executar({ id: outro.id, dados: { nome: 'Santa Monica' } }), ErroDeConflito);
    });
  });

  it('deve responder 404 quando o bairro não existe', async () => {
    const { casoDeUso } = preparar();

    await esperarErro(() => casoDeUso.executar({ id: 'nao-existe', dados: {} }), ErroNaoEncontrado);
  });
});
