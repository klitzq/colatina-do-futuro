import { expect } from 'vitest';
import type { ErroDeAplicacao } from '@/servidor/nucleo/erros/erros';

type ClasseDeErro = abstract new (...args: never[]) => ErroDeAplicacao;

/**
 * Confere que a operação falha com o erro de aplicação esperado (e, se informada, a mensagem).
 *   await esperarErro(() => caso.executar(dados), ErroDeConflito, 'Já existe');
 */
export async function esperarErro(
  operacao: () => unknown,
  classe: ClasseDeErro,
  mensagem?: string | RegExp,
): Promise<ErroDeAplicacao> {
  let capturado: unknown;
  try {
    await operacao();
  } catch (erro) {
    capturado = erro;
  }
  expect(capturado, `esperava ${classe.name}, mas a operação não falhou`).toBeInstanceOf(classe);
  if (mensagem !== undefined) expect((capturado as Error).message).toMatch(mensagem);
  return capturado as ErroDeAplicacao;
}
