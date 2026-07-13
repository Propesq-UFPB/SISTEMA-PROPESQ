# Integração Front-end × PROPESQ Backend

## Configuração

```env
VITE_API_URL=http://localhost:3000
VITE_AUTH_MODE=api
```

O Swagger está em `/api`, mas a API não possui prefixo global `/api`.

## Autenticação

- `POST /authentications/sessions`
- token salvo em `access_token`
- usuário salvo em `auth_user`
- `ADMIN` e `GESTOR` são apresentados no front como `ADMINISTRADOR`

## Projetos integrados (Mariana)

- `GET /research-projects`
- `GET /research-projects/:id`
- `PATCH /research-projects/:id`
- `DELETE /research-projects/:id`
- `PATCH /research-projects/:id/publish`
- `GET /research-projects/my-evaluations`

As páginas de lista e detalhes são compartilhadas pelos três perfis. As rotas antigas permanecem.

## Limitações atuais (para integração com projetos) do back-end

1. A listagem aceita somente `limit` e `offset`. Busca e filtros são locais na página atual.
2. Não existe endpoint de “meus projetos” do discente.
3. O cadastro exige IDs de categoria, palavras-chave, ODS, corpo, atividades e unidade.
4. Não existem endpoints públicos suficientes para criar corpo, atividades e palavras-chave a partir do formulário completo.
5. A resposta de projeto não informa unidade, vigência, data inicial/final, orientador, edital, vínculo, participação ou pendências.
6. O back-end precisa habilitar CORS quando front e API estiverem em origens diferentes.

## Organização para os outros módulos

Novas integrações devem seguir `src/features/<modulo>/{api,components,types}`. Os arquivos em `src/pages` devem ser wrappers de rota e configuração, evitando regras de negócio e chamadas HTTP duplicadas.
