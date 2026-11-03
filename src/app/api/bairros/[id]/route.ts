import { moduloBairro } from '@/servidor/modulos/bairro/bairro.modulo';

const { controlador } = moduloBairro();

export const GET = controlador.buscar;
export const PATCH = controlador.atualizar;
export const DELETE = controlador.remover;
