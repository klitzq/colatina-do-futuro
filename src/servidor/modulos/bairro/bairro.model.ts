import { Entidade, type CamposBase } from '@/servidor/nucleo/model/entidade';
import { exigirBooleano, exigirOpcao, exigirTexto } from '@/servidor/nucleo/validacao/regras';
import { REGIOES, type AtualizarBairro, type CriarBairro, type PropriedadesBairro } from './bairro.types';

/** Bairro de Colatina. Módulo de exemplo do padrão: copie esta estrutura nos novos módulos. */
export class Bairro extends Entidade<PropriedadesBairro> {
  /** Registro novo: aplica as regras e começa ativo. */
  static criar(dados: CriarBairro): Bairro {
    return new Bairro({ nome: dados.nome, regiao: dados.regiao, ativo: true }).inicializar();
  }

  /** Registro vindo do banco. */
  static restaurar(props: PropriedadesBairro, base: CamposBase): Bairro {
    return new Bairro(props, base);
  }

  get nome(): string {
    return this.props.nome;
  }

  get regiao() {
    return this.props.regiao;
  }

  get ativo(): boolean {
    return this.props.ativo;
  }

  atualizar(dados: AtualizarBairro): void {
    this.alterar(dados);
  }

  desativar(): void {
    this.alterar({ ativo: false });
  }

  protected validar(props: PropriedadesBairro): PropriedadesBairro {
    return {
      nome: exigirTexto(props.nome, 'o nome do bairro', { minimo: 3, maximo: 80 }),
      regiao: exigirOpcao(props.regiao, REGIOES, 'a região'),
      ativo: exigirBooleano(props.ativo, 'o campo ativo'),
    };
  }
}
