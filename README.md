# SISTEMA PROPESQ 

Interface web do sistema PROPESQ para gerenciamento de projetos, editais, planos de trabalho, avaliações, relatórios e certificados relacionados aos fluxos de iniciação científica.

O projeto foi desenvolvido com **React + Vite + TypeScript**, com navegação segmentada por perfil de usuário:

- **Discente**
- **Coordenador**
- **Administrador / PROPESQ**

> [!NOTE]
> XXX


### Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Lucide React
- CSS modularizado por páginas/componentes

### Requisitos

Antes de rodar o projeto, é necessário ter instalado:

- Node.js
- npm
- Backend da PROPESQ rodando localmente


### Organização geral do projeto

```text
src/
├── components/
│   └── AppHeader.tsx
│
├── context/
│   └── AuthContext.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── adm/
│   ├── coordenador/
│   └── discente/
│
├── styles/
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```
