/**
 * Monta a query string ignorando valores vazios.
 * Listas viram texto separado por vírgula (ex.: ids=a,b).
 */
export function comQuery(caminho: string, parametros?: object): string {
  const busca = new URLSearchParams();
  for (const [chave, valor] of Object.entries(parametros ?? {})) {
    if (valor === undefined || valor === null || valor === '') continue;
    busca.append(chave, Array.isArray(valor) ? valor.join(',') : String(valor));
  }
  const texto = busca.toString();
  return texto ? `${caminho}?${texto}` : caminho;
}
