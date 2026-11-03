/**
 * Cria a instância só na primeira chamada e reaproveita depois (singleton preguiçoso).
 * Usado no `<modulo>.modulo.ts`, a composition root de cada módulo.
 */
export function umaVez<T>(criar: () => T): () => T {
  let instancia: T | undefined;
  return () => (instancia ??= criar());
}
