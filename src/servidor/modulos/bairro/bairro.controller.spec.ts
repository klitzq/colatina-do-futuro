import { describe, expect, it } from 'vitest';
import { umBairro } from '@/test/fabricas/bairro.fabrica';
import { chamarRota } from '@/test/utilitarios/http';
import { criarModuloBairro } from './bairro.modulo';

/**
 * Teste de integração do módulo: route handler → controller → caso de uso → repositório em memória.
 * Confere só o contrato HTTP (status e formato); as regras ficam nos testes dos casos de uso.
 */
function preparar() {
  return criarModuloBairro();
}

describe('BairroController (HTTP)', () => {
  it('POST /bairros cria e responde 201 com o JSON da entidade', async () => {
    const { controlador } = preparar();

    const { status, corpo } = await chamarRota(controlador.criar, { metodo: 'POST', caminho: 'bairros', corpo: { nome: 'Centro', regiao: 'CENTRO' } });

    expect(status).toBe(201);
    expect(corpo).toMatchObject({ id: expect.any(String), nome: 'Centro', regiao: 'CENTRO', ativo: true, criadoEm: expect.any(String) });
  });

  it('GET /bairros responde paginado e aceita filtros pela query', async () => {
    const { controlador, repositorio } = preparar();
    await repositorio.salvar(umBairro({ regiao: 'NORTE' }));
    await repositorio.salvar(umBairro({ regiao: 'SUL' }));

    const { status, corpo } = await chamarRota(controlador.listar, { caminho: 'bairros?regiao=NORTE&porPagina=5' });

    expect(status).toBe(200);
    expect(corpo).toMatchObject({ total: 1, pagina: 1, porPagina: 5, itens: [{ regiao: 'NORTE' }] });
  });

  it('GET /bairros/:id responde 404 no formato { statusCode, message }', async () => {
    const { controlador } = preparar();

    const { status, corpo } = await chamarRota(controlador.buscar, { caminho: 'bairros/x', params: { id: 'x' } });

    expect(status).toBe(404);
    expect(corpo).toMatchObject({ statusCode: 404, message: 'Bairro não encontrado.' });
  });

  it('responde 400 quando o corpo não é JSON', async () => {
    const { controlador } = preparar();

    const { status } = await chamarRota(controlador.criar, { metodo: 'POST', caminho: 'bairros', corpo: '{quebrado' });

    expect(status).toBe(400);
  });

  it('DELETE /bairros/:id responde 422 para bairro ativo e 204 depois de desativar', async () => {
    const { controlador, repositorio } = preparar();
    const bairro = await repositorio.salvar(umBairro());
    const params = { id: bairro.id };

    expect((await chamarRota(controlador.remover, { metodo: 'DELETE', params })).status).toBe(422);
    await chamarRota(controlador.atualizar, { metodo: 'PATCH', params, corpo: { ativo: false } });
    expect((await chamarRota(controlador.remover, { metodo: 'DELETE', params })).status).toBe(204);
  });
});
