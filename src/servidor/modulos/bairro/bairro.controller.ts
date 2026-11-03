import { ControladorBase } from '@/servidor/nucleo/controller/controlador-base';
import { ErroDeValidacao } from '@/servidor/nucleo/erros/erros';
import { exigirOpcao } from '@/servidor/nucleo/validacao/regras';
import type { AtualizarBairroCasoDeUso } from './casos-de-uso/atualizar-bairro.caso-de-uso';
import type { BuscarBairroCasoDeUso, ListarBairrosCasoDeUso } from './casos-de-uso/consultar-bairros.caso-de-uso';
import type { CriarBairroCasoDeUso } from './casos-de-uso/criar-bairro.caso-de-uso';
import type { RemoverBairroCasoDeUso } from './casos-de-uso/remover-bairro.caso-de-uso';
import { REGIOES, type AtualizarBairro, type CriarBairro, type FiltroBairros } from './bairro.types';

export interface CasosDeUsoBairro {
  criar: CriarBairroCasoDeUso;
  atualizar: AtualizarBairroCasoDeUso;
  remover: RemoverBairroCasoDeUso;
  buscar: BuscarBairroCasoDeUso;
  listar: ListarBairrosCasoDeUso;
}

type ParamsId = { id: string };

/** Rotas /api/bairros. Só traduz HTTP ↔ caso de uso. */
export class BairroController extends ControladorBase {
  constructor(private readonly casos: CasosDeUsoBairro) {
    super();
  }

  listar = this.rota(async ({ consulta, contexto }) => {
    const { pagina, porPagina, ...resto } = consulta;
    return this.casos.listar.executar({ filtro: filtroDaConsulta(resto), paginacao: { pagina, porPagina } }, contexto);
  });

  buscar = this.rota<ParamsId>(async ({ params, contexto }) => this.casos.buscar.executar(params.id, contexto));

  criar = this.rota(async ({ corpo, contexto }) => this.criado(await this.casos.criar.executar(await corpo<CriarBairro>(), contexto)));

  atualizar = this.rota<ParamsId>(async ({ params, corpo, contexto }) =>
    this.casos.atualizar.executar({ id: params.id, dados: await corpo<AtualizarBairro>() }, contexto),
  );

  remover = this.rota<ParamsId>(async ({ params, contexto }) => {
    await this.casos.remover.executar(params.id, contexto);
    return this.semConteudo();
  });
}

function filtroDaConsulta(consulta: Record<string, string>): FiltroBairros {
  const filtro: FiltroBairros = {};
  if (consulta.regiao) filtro.regiao = exigirOpcao(consulta.regiao, REGIOES, 'a região');
  if (consulta.busca) filtro.busca = consulta.busca;
  if (consulta.ativo !== undefined) {
    if (consulta.ativo !== 'true' && consulta.ativo !== 'false') throw new ErroDeValidacao('ativo deve ser true ou false.');
    filtro.ativo = consulta.ativo === 'true';
  }
  return filtro;
}
