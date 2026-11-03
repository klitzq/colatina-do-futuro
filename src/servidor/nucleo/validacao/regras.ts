import { ErroDeValidacao, type ErroDeAplicacao } from '../erros/erros';

/** Lança `erro` quando a condição é falsa. */
export function garantir(condicao: unknown, erro: ErroDeAplicacao): asserts condicao {
  if (!condicao) throw erro;
}

interface OpcoesDeTexto {
  minimo?: number;
  maximo?: number;
}

/** Exige um texto preenchido dentro do tamanho informado e devolve o texto sem espaços nas pontas. */
export function exigirTexto(valor: unknown, campo: string, { minimo = 1, maximo = 255 }: OpcoesDeTexto = {}): string {
  if (typeof valor !== 'string' || valor.trim().length === 0) {
    throw new ErroDeValidacao(`Informe ${campo}.`);
  }
  const texto = valor.trim();
  if (texto.length < minimo) throw new ErroDeValidacao(`${primeiraMaiuscula(campo)} deve ter ao menos ${minimo} caracteres.`);
  if (texto.length > maximo) throw new ErroDeValidacao(`${primeiraMaiuscula(campo)} deve ter no máximo ${maximo} caracteres.`);
  return texto;
}

/** Exige que o valor seja uma das opções permitidas (útil para enums). */
export function exigirOpcao<T extends string>(valor: unknown, opcoes: readonly T[], campo: string): T {
  if (typeof valor !== 'string' || !opcoes.includes(valor as T)) {
    throw new ErroDeValidacao(`${primeiraMaiuscula(campo)} inválido. Use: ${opcoes.join(', ')}.`);
  }
  return valor as T;
}

/** Exige um booleano quando o campo é informado. */
export function exigirBooleano(valor: unknown, campo: string): boolean {
  if (typeof valor !== 'boolean') throw new ErroDeValidacao(`${primeiraMaiuscula(campo)} deve ser verdadeiro ou falso.`);
  return valor;
}

/** Texto sem acentos, em minúsculas e sem espaços extras, para comparar nomes. */
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function primeiraMaiuscula(texto: string): string {
  const semArtigo = texto.replace(/^(o|a|os|as) /i, '');
  return semArtigo.charAt(0).toUpperCase() + semArtigo.slice(1);
}
