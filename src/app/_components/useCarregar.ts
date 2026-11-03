'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Estado<T> {
  /** Dependências da última carga concluída. */
  chave: string | null;
  dados: T | null;
  erro: string | null;
  recarregando: boolean;
}

/**
 * Carrega dados de um service e expõe { dados, carregando, erro, recarregar }.
 * Recarrega quando as dependências mudam; respostas atrasadas de uma consulta antiga são descartadas.
 */
export function useCarregar<T>(buscar: () => Promise<T>, dependencias: unknown[] = []) {
  const [estado, setEstado] = useState<Estado<T>>({ chave: null, dados: null, erro: null, recarregando: false });
  const versao = useRef(0);
  const buscarAtual = useRef(buscar);
  const chave = JSON.stringify(dependencias);

  useEffect(() => {
    buscarAtual.current = buscar;
  });

  /** Busca e grava o resultado só depois da resposta (nada de setState síncrono no efeito). */
  const carregar = useCallback((chaveAtual: string) => {
    const atual = ++versao.current;
    buscarAtual.current().then(
      (dados) => {
        if (atual === versao.current) setEstado({ chave: chaveAtual, dados, erro: null, recarregando: false });
      },
      (e: unknown) => {
        if (atual === versao.current) {
          const erro = e instanceof Error ? e.message : 'Erro inesperado.';
          setEstado((anterior) => ({ ...anterior, chave: chaveAtual, erro, recarregando: false }));
        }
      },
    );
  }, []);

  useEffect(() => {
    carregar(chave);
  }, [chave, carregar]);

  const recarregar = useCallback(() => {
    setEstado((anterior) => ({ ...anterior, recarregando: true }));
    carregar(chave);
  }, [chave, carregar]);

  return {
    dados: estado.dados,
    erro: estado.erro,
    carregando: estado.recarregando || estado.chave !== chave,
    recarregar,
  };
}
