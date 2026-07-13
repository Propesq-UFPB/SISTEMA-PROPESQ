# Status da integração de projetos

## Integrado no front-end

- Login em `POST /authentications/sessions`.
- Persistência de `accessToken` em `access_token`.
- Listagem paginada em `GET /research-projects?limit=&offset=`.
- Detalhes em `GET /research-projects/:id`.
- Atualização dos campos `titulo`, `title` e `email` com `PATCH /research-projects/:id`.
- Exclusão com `DELETE /research-projects/:id` para administrador.
- Componentes de lista e detalhes compartilhados por discente, coordenador e administrador.
- Campos não retornados pela API aparecem como `—`.

## Pendências críticas no back-end

### 1. A listagem pode falhar no `formatResearch`

`findAll`, `findMyEvaluations` e `getRanking` usam `research.categoria.denominacao`, mas não incluem a relação `categoria`. Também formatam atividades sem incluí-las e os objetivos da listagem não incluem a relação `objetivo`.

A consulta precisa incluir, no mínimo:

```ts
include: {
  categoria: true,
  corpo_projeto: true,
  palavra_chave: true,
  objetivos: { include: { objetivo: true } },
  atividades: { include: { meses: true } },
}
```

E o mapper deve usar `objetivo.objetivo`, conforme o formato real da relação.

### 2. Atualização pode tentar conectar unidade indefinida

No `update`, `unidade_academica.connect` é executado mesmo quando `unidade_id` não foi enviado. Para permitir PATCH parcial, esse bloco deve ser condicional.

### 3. CORS

Adicionar `app.enableCors(...)` no `main.ts` quando front e back estiverem em origens diferentes.

### 4. Filtros

Adicionar filtros à listagem: texto/título, código, situação, categoria, unidade, período e orientador. Atualmente o front filtra apenas os dez itens carregados na página.

### 5. Escopo por perfil

Criar endpoint de projetos do usuário autenticado, por exemplo `GET /research-projects/mine`. A listagem geral atualmente entrega todos os projetos para qualquer usuário autenticado.

### 6. Cadastro completo

O DTO exige IDs de corpo, atividades, palavras-chave, ODS, categoria e unidade. Faltam endpoints ou um endpoint transacional capaz de receber o formulário completo e criar os registros relacionados.

Sugestão: `POST /research-projects/full`, recebendo o corpo, palavras-chave e cronograma no mesmo payload, dentro de uma transação.

### 7. Campos necessários para preencher toda a interface

A resposta de detalhes precisa retornar também:

- unidade acadêmica e seu ID;
- vigência, data inicial e data final;
- orientador/coordenador;
- edital relacionado;
- centro;
- vínculo e tipo de participação do discente;
- pendências;
- grupo e linha de pesquisa;
- anexos;
- pontuação e histórico de avaliação, conforme permissão.
