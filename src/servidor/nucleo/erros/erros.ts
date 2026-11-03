/**
 * Erros da aplicação. Cada um carrega o status HTTP que o controller devolve,
 * então as camadas de baixo só lançam o erro certo e não conhecem HTTP.
 * O corpo da resposta segue o formato do NestJS (`{ statusCode, message }`),
 * o mesmo dos outros backends, para os fronts tratarem os erros do mesmo jeito.
 */
export abstract class ErroDeAplicacao extends Error {
  abstract readonly status: number;

  constructor(
    mensagem: string,
    public readonly detalhes?: unknown,
  ) {
    super(mensagem);
    this.name = new.target.name;
  }
}

/** 400: a entrada veio em formato inválido (campo faltando, tamanho, tipo). */
export class ErroDeValidacao extends ErroDeAplicacao {
  readonly status = 400;
}

/** 401: falta identificar o usuário. */
export class ErroNaoAutenticado extends ErroDeAplicacao {
  readonly status = 401;
}

/** 403: o usuário está identificado, mas não pode fazer isso. */
export class ErroAcessoNegado extends ErroDeAplicacao {
  readonly status = 403;
}

/** 404: o registro não existe. */
export class ErroNaoEncontrado extends ErroDeAplicacao {
  readonly status = 404;
}

/** 409: conflito com um registro existente (ex.: nome repetido). */
export class ErroDeConflito extends ErroDeAplicacao {
  readonly status = 409;
}

/** 422: a entrada é válida, mas uma regra de negócio impede a operação. */
export class ErroDeRegraDeNegocio extends ErroDeAplicacao {
  readonly status = 422;
}
