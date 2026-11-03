import { describe, expect, it } from 'vitest';
import { ErroDeRegraDeNegocio, ErroNaoEncontrado } from '@/servidor/nucleo/erros/erros';
import { umBairro, umBairroInativo } from '@/test/fabricas/bairro.fabrica';
import { esperarErro } from '@/test/utilitarios/erros';
import { BairroRepositoryEmMemoria } from '../bairro.repository';
import { BairroService } from '../bairro.service';
import { RemoverBairroCasoDeUso } from './remover-bairro.caso-de-uso';

function preparar() {
  const repositorio = new BairroRepositoryEmMemoria();
  const casoDeUso = new RemoverBairroCasoDeUso(repositorio, new BairroService());
  return { repositorio, casoDeUso };
}

describe('RemoverBairroCasoDeUso', () => {
  describe('Regra: só remove bairro desativado', () => {
    it('deve remover um bairro inativo', async () => {
      const { repositorio, casoDeUso } = preparar();
      const bairro = await repositorio.salvar(umBairroInativo());

      await casoDeUso.executar(bairro.id);

      expect(await repositorio.existe(bairro.id)).toBe(false);
    });

    it('deve recusar bairro ativo e mantê-lo gravado', async () => {
      const { repositorio, casoDeUso } = preparar();
      const bairro = await repositorio.salvar(umBairro());

      await esperarErro(() => casoDeUso.executar(bairro.id), ErroDeRegraDeNegocio, /Desative/);
      expect(await repositorio.existe(bairro.id)).toBe(true);
    });
  });

  it('deve responder 404 quando o bairro não existe', async () => {
    const { casoDeUso } = preparar();

    await esperarErro(() => casoDeUso.executar('nao-existe'), ErroNaoEncontrado);
  });
});
