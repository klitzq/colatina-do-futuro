# Colatina do Futuro

**Simulador de trânsito para Colatina (ES)** · [Português](#português) · [English](#english)

> 🚧 **Projeto em fase inicial.** Por enquanto, este repositório contém a base de arquitetura e testes sobre a qual o simulador será construído. O modelo 3D, a simulação e o índice de eficiência ainda serão desenvolvidos.

---

## Português

### Ideia central

> O trânsito de Colatina cresceu junto com uma cidade que nunca foi planejada para ele. O **Colatina do Futuro** propõe um simulador 3D da cidade para testar, antes de executar nas ruas, medidas como mudanças de rota, semáforos inteligentes e novas faixas de pedestres. Um índice de eficiência mede o resultado de cada cenário e ajuda a Prefeitura a decidir com base em dados.

### Apresentação

O projeto é idealizado por João Victor Klitzke, morador de Colatina, cidade de médio porte do Noroeste do Espírito Santo. O autor cresceu na cidade e ainda vive nela, o que lhe permitiu conhecer de perto problemas estruturais e sociais que só aparecem para quem vive o dia a dia do município.

Colatina é uma cidade bonita, conhecida como a *Princesinha do Norte* e famosa pelo pôr do sol. Essa beleza, porém, fica em segundo plano diante de um problema central: **o trânsito**.

### Justificativa

Colatina não foi planejada para o volume de veículos que tem hoje. Ruas, becos e vielas surgiram ao longo do tempo, sem um planejamento viário que pensasse no tráfego como um todo. O resultado aparece todos os dias, principalmente nos horários de pico:

- gargalos no centro da cidade;
- dificuldade de passagem para veículos de emergência;
- semáforos de tempo fixo, que não se adaptam ao fluxo real;
- pontos com mais acidentes, sem medição sistemática.

Hoje, uma mudança no trânsito só pode ser avaliada depois de feita nas ruas, com custo e transtorno para a população. **Falta uma forma de testar as medidas antes.** É essa lacuna que este projeto quer preencher.

### Proposta

Este projeto apresenta uma proposta de intervenção: um **simulador de trânsito** que integra uma série de projetos que o autor, com otimismo, chamou de *Colatina do Futuro*.

O simulador vai reproduzir a cidade em um modelo 3D para comparar cenários e medidas, como:

- criação de passagens e desvios, e alteração de rotas;
- rotas mais rápidas para veículos de emergência;
- controle inteligente de semáforos;
- posicionamento de faixas de pedestres;
- redução de gargalos nos horários de pico;
- posicionamento de pontos de fiscalização e bloqueios policiais;
- identificação e medição das zonas com mais acidentes.

Cada cenário recebe uma **pontuação de eficiência do trânsito**, calculada a partir de indicadores como tempo de viagem, filas e pontos de conflito. Com ela, é possível comparar alternativas e mostrar o que mais melhora a vida de quem circula pela cidade.

O objetivo é oferecer à Prefeitura de Colatina uma **ferramenta de apoio à decisão** para planejar o trânsito com base em dados e reduzir os problemas que afetam o cidadão colatinense no dia a dia.

---

## English

### Core idea

> Colatina's traffic grew alongside a city that was never planned for it. **Colatina do Futuro** (*Colatina of the Future*) proposes a 3D simulator of the city to test measures such as route changes, smart traffic lights and new crosswalks before applying them on the streets. An efficiency score measures the result of each scenario and helps City Hall make data-driven decisions.

### About the author

The project is conceived by João Victor Klitzke, a resident of Colatina, a mid-sized city in northwestern Espírito Santo, Brazil. The author grew up in the city and still lives there, which gave him a close view of structural and social problems that only show up to those who experience the city every day.

Colatina is a beautiful city, known as the *Princesinha do Norte* ("Little Princess of the North") and famous for its sunsets. That beauty, however, takes a back seat to one central problem: **traffic**.

### Rationale

Colatina was not planned for the number of vehicles it has today. Streets, alleys and lanes appeared over time without road planning that considered traffic as a whole. The result shows up every day, especially at rush hour:

- bottlenecks downtown;
- emergency vehicles struggling to get through;
- fixed-time traffic lights that do not adapt to actual flow;
- accident hotspots with no systematic measurement.

Today, a traffic change can only be evaluated after it is made on the streets, at a cost and inconvenience to residents. **There is no way to test measures beforehand.** This project aims to fill that gap.

### Proposal

This project is an intervention proposal: a **traffic simulator** that is part of a series of projects the author optimistically named *Colatina do Futuro*.

The simulator will reproduce the city as a 3D model to compare scenarios and measures, such as:

- new passages, detours and route changes;
- faster routes for emergency vehicles;
- smart traffic light control;
- crosswalk placement;
- reducing rush-hour bottlenecks;
- placement of enforcement points and police checkpoints;
- identifying and measuring accident-prone zones.

Each scenario receives a **traffic efficiency score**, calculated from indicators such as travel time, queues and conflict points. It makes it possible to compare alternatives and show which ones most improve life for people moving around the city.

The goal is to offer Colatina City Hall a **decision-support tool** for data-driven traffic planning and for reducing the problems that affect residents' daily lives.

---

## Documentação

- [Dossiê de ferramentas e conceitos](docs/dossie-ferramentas.html): ferramentas de simulação e 3D, conceitos de tráfego e segurança viária, legislação, intervenções, índice de pontuação e trilha de estudo. O arquivo pode ser aberto diretamente no navegador ou consultado pelo [visualizador de HTML](https://htmlpreview.github.io/?https://github.com/klitzq/colatina-do-futuro/blob/main/docs/dossie-ferramentas.html).

---

## Estrutura técnica

Next.js 16 (App Router) com o backend no próprio projeto (`src/app/api`), organizado em camadas com classes abstratas genéricas.

```bash
pnpm dev          # http://localhost:3000
pnpm test         # testes (Vitest)
pnpm test:watch
pnpm typecheck
pnpm lint
pnpm build
```

### Estrutura

```
src/
  app/                          Next: páginas, layouts e route handlers
    api/<recurso>/route.ts        só liga as rotas ao controller do módulo
    _services/                    chamadas à API pelo front (api<T>, ServicoCrud)
    _types/                       tipos do front (interface principal com export default)
    _components/                  componentes e hooks (useCarregar)
  servidor/
    nucleo/                       bases genéricas, herdadas pelos módulos
      model/entidade.ts             Entidade<TProps>
      repository/repositorio.ts     Repositorio<TEntidade, TFiltro> (interface)
      repository/repositorio-em-memoria.ts  RepositorioEmMemoria<TEntidade, TFiltro>
      service/servico-base.ts       ServicoBase
      application/caso-de-uso.ts    CasoDeUso<TEntrada, TSaida>, BuscarPorIdCasoDeUso, ListarCasoDeUso
      controller/controlador-base.ts  ControladorBase, RespostaHttp
      erros/erros.ts                ErroDeValidacao (400) … ErroDeRegraDeNegocio (422)
      validacao/regras.ts           exigirTexto, exigirOpcao, garantir…
      tipos/paginacao.ts            Paginacao, Paginado, normalizarPaginacao
      modulo/uma-vez.ts             singleton preguiçoso da composition root
    modulos/
      bairro/                       módulo de exemplo, modelo para os demais módulos
test/
  fabricas/                     dados de teste válidos por padrão (Test Data Builder)
  contratos/                    testes que toda implementação de Repositorio deve passar
  utilitarios/                  esperarErro, chamarRota
```

### Fluxo de uma requisição

```
route.ts → Controller → CasoDeUso → Service (regras puras) + Repository → Entidade
```

| Camada | Base | Faz | Não faz |
|---|---|---|---|
| Model | `Entidade<TProps>` | invariantes do registro (`validar`), `criar`/`restaurar`/`alterar` | acessar banco |
| Repository | `Repositorio` + `RepositorioEmMemoria` | ler e gravar | regra de negócio |
| Service | `ServicoBase` | regras que envolvem mais de um dado (nome único, pode remover?) | I/O |
| Caso de uso | `CasoDeUso<E, S>` | uma regra/ação do negócio: busca, pede decisão ao service, grava | HTTP |
| Controller | `ControladorBase` | lê query/corpo/params, chama o caso de uso, converte erros em status | regra |

Os erros de `nucleo/erros` viram resposta `{ statusCode, message }`, no mesmo formato dos backends NestJS.

### Composição de um módulo

Cada módulo segue a estrutura do módulo de exemplo `src/servidor/modulos/bairro`:

1. Arquivos por camada: `<nome>.types.ts`, `<nome>.model.ts`, `<nome>.repository.ts`, `<nome>.service.ts`,
   `casos-de-uso/<acao>-<nome>.caso-de-uso.ts`, `<nome>.controller.ts` e `<nome>.modulo.ts`.
2. Um caso de uso por regra de negócio, cada um acompanhado do seu `.spec.ts`.
3. Uma fábrica de dados de teste em `test/fabricas/<nome>.fabrica.ts`.
4. As rotas expostas em `src/app/api/<recurso>/route.ts` (`export const GET = controlador.listar`).
5. No frontend, `_types/<nome>.ts` e `_services/<nome>.ts`, este último herdando `ServicoCrud`.

### Padrão de testes

- Cada arquivo `*.spec.ts` fica ao lado do código que testa.
- **Caso de uso:** `preparar()` monta o caso de uso com repositório em memória; um `describe('Regra: ...')` por regra; `it('deve ...')` por cenário; corpo em Dado / Quando / Então; erros com `esperarErro(() => ..., ErroDeConflito)`.
- **Repository:** `testarContratoDoRepositorio(...)` mais os testes das consultas próprias. Quando houver banco, a implementação real roda o mesmo contrato.
- **Controller:** integração HTTP com `chamarRota(controlador.acao, {...})`. Verifica apenas status e formato das respostas, pois as regras já estão cobertas nos casos de uso.

### Banco de dados

Nesta fase, o projeto não utiliza banco de dados: `bairro.modulo.ts` usa `BairroRepositoryEmMemoria`. A adoção de um banco consiste em criar uma nova implementação do repositório (por exemplo, `BairroRepositoryPrisma implements BairroRepository`), submetê-la ao mesmo contrato de testes e substituir a instância em `criarModuloBairro`.
