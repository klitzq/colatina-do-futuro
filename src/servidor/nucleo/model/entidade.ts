/** Campos que toda entidade tem. */
export interface CamposBase {
  id: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

/** Forma serializada (JSON) de uma entidade: os campos dela mais os campos base. */
export type EntidadeJSON<TProps extends object> = TProps & CamposBase;

/**
 * Base de todos os models.
 *
 * - `TProps` são os campos próprios da entidade (sem id e datas).
 * - O construtor é protegido: cada model expõe `criar()` (registro novo, aplica as regras)
 *   e `restaurar()` (registro vindo do banco, que já foi validado ao ser gravado).
 * - Toda alteração passa por `alterar()`, que valida de novo e atualiza `atualizadoEm`.
 */
export abstract class Entidade<TProps extends object> {
  readonly id: string;
  readonly criadoEm: Date;
  private _atualizadoEm: Date;
  private _props: TProps;

  protected constructor(props: TProps, base: Partial<CamposBase> = {}) {
    const agora = new Date();
    this.id = base.id ?? crypto.randomUUID();
    this.criadoEm = base.criadoEm ?? agora;
    this._atualizadoEm = base.atualizadoEm ?? this.criadoEm;
    this._props = props;
  }

  /**
   * Confere as invariantes da entidade e devolve os campos normalizados (ex.: texto sem espaços nas pontas).
   * Lança ErroDeValidacao/ErroDeRegraDeNegocio.
   */
  protected abstract validar(props: TProps): TProps;

  get atualizadoEm(): Date {
    return this._atualizadoEm;
  }

  /** Campos atuais (somente leitura). */
  protected get props(): Readonly<TProps> {
    return this._props;
  }

  /** Aplica uma alteração parcial, valida e atualiza `atualizadoEm`. */
  protected alterar(alteracao: Partial<TProps>): void {
    this._props = this.validar({ ...this._props, ...alteracao });
    this._atualizadoEm = new Date();
  }

  /** Valida os campos iniciais. Chame no `criar()` da entidade filha. */
  protected inicializar(): this {
    this._props = this.validar(this._props);
    return this;
  }

  /** Cópia independente (mesma classe, mesmos dados). Usada pelo repositório em memória. */
  clonar(): this {
    const copia = Object.create(Object.getPrototypeOf(this)) as this;
    Object.assign(copia, this);
    copia._props = { ...this._props };
    return copia;
  }

  /** Duas entidades são iguais quando têm o mesmo id. */
  igual(outra: Entidade<TProps> | null | undefined): boolean {
    return !!outra && outra.id === this.id;
  }

  /** Forma enviada nas respostas da API. */
  paraJSON(): EntidadeJSON<TProps> {
    return { id: this.id, ...this._props, criadoEm: this.criadoEm, atualizadoEm: this._atualizadoEm };
  }
}
