import { Bairro } from '@/servidor/modulos/bairro/bairro.model';
import type { CriarBairro } from '@/servidor/modulos/bairro/bairro.types';

let sequencia = 0;

/**
 * Fábricas de teste (padrão Test Data Builder): devolvem dados válidos por padrão,
 * e o teste só sobrescreve o campo que importa para o cenário.
 */
export function dadosDeBairro(sobrescrever: Partial<CriarBairro> = {}): CriarBairro {
  sequencia += 1;
  return { nome: `Bairro de Teste ${sequencia}`, regiao: 'CENTRO', ...sobrescrever };
}

export function umBairro(sobrescrever: Partial<CriarBairro> = {}): Bairro {
  return Bairro.criar(dadosDeBairro(sobrescrever));
}

export function umBairroInativo(sobrescrever: Partial<CriarBairro> = {}): Bairro {
  const bairro = umBairro(sobrescrever);
  bairro.desativar();
  return bairro;
}
