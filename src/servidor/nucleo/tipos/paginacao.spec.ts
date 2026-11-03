import { describe, expect, it } from 'vitest';
import { ErroDeValidacao } from '../erros/erros';
import { esperarErro } from '@/test/utilitarios/erros';
import { normalizarPaginacao, paginar } from './paginacao';

describe('normalizarPaginacao', () => {
  it('usa página 1 e 20 por página quando nada é informado', () => {
    expect(normalizarPaginacao()).toEqual({ pagina: 1, porPagina: 20 });
  });

  it('converte o texto da query em número', () => {
    expect(normalizarPaginacao({ pagina: '3', porPagina: '10' })).toEqual({ pagina: 3, porPagina: 10 });
  });

  it.each([{ pagina: '0' }, { pagina: 'abc' }, { porPagina: '101' }])('recusa %o', async (entrada) => {
    await esperarErro(() => normalizarPaginacao(entrada), ErroDeValidacao);
  });
});

describe('paginar', () => {
  it('calcula o total de páginas (mínimo 1)', () => {
    expect(paginar([], 0, { pagina: 1, porPagina: 10 }).totalPaginas).toBe(1);
    expect(paginar([], 21, { pagina: 1, porPagina: 10 }).totalPaginas).toBe(3);
  });
});
