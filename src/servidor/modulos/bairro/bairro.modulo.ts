import { umaVez } from '@/servidor/nucleo/modulo/uma-vez';
import { BairroController } from './bairro.controller';
import { BairroRepositoryEmMemoria, type BairroRepository } from './bairro.repository';
import { BairroService } from './bairro.service';
import { AtualizarBairroCasoDeUso } from './casos-de-uso/atualizar-bairro.caso-de-uso';
import { BuscarBairroCasoDeUso, ListarBairrosCasoDeUso } from './casos-de-uso/consultar-bairros.caso-de-uso';
import { CriarBairroCasoDeUso } from './casos-de-uso/criar-bairro.caso-de-uso';
import { RemoverBairroCasoDeUso } from './casos-de-uso/remover-bairro.caso-de-uso';

export interface DependenciasBairro {
  repositorio?: BairroRepository;
}

/**
 * Composition root do módulo: monta repository → service → casos de uso → controller.
 * Os testes chamam `criarModuloBairro({ repositorio })` para injetar o repositório que quiserem.
 * Quando houver banco, troque o padrão aqui (ex.: `new BairroRepositoryPrisma(prisma)`).
 */
export function criarModuloBairro({ repositorio = new BairroRepositoryEmMemoria() }: DependenciasBairro = {}) {
  const service = new BairroService();
  const casos = {
    criar: new CriarBairroCasoDeUso(repositorio, service),
    atualizar: new AtualizarBairroCasoDeUso(repositorio, service),
    remover: new RemoverBairroCasoDeUso(repositorio, service),
    buscar: new BuscarBairroCasoDeUso(repositorio),
    listar: new ListarBairrosCasoDeUso(repositorio),
  };
  return { repositorio, service, casos, controlador: new BairroController(casos) };
}

/** Instância única usada pelos route handlers. */
export const moduloBairro = umaVez(() => criarModuloBairro());
