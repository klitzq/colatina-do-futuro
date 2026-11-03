import { moduloBairro } from '@/servidor/modulos/bairro/bairro.modulo';

const { controlador } = moduloBairro();

export const GET = controlador.listar;
export const POST = controlador.criar;
