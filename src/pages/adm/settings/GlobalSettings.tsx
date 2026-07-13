// não to usando
import React from "react"
import { NavLink } from "react-router-dom"
import { ShieldCheck, Building2, BookUser, Users } from "lucide-react"

function CardLink({
  to,
  title,
  desc,
  icon,
}: {
  to: string
  title: string
  desc: string
  icon: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className="block rounded-xl border border-neutral-light bg-white p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-neutral-light/60">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-primary">{title}</h3>
          <p className="text-sm text-neutral mt-1">{desc}</p>
        </div>
      </div>
    </NavLink>
  )
}

export default function GlobalSettings() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      <header>
        <h1 className="text-xl font-bold text-primary">Configurações Globais</h1>
        <p className="text-sm text-neutral">
          Gerencie parâmetros estruturais do sistema que impactam editais, projetos e usuários.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardLink
          to="/adm/settings/scholarships"
          title="Entidades & Tipos de Bolsa"
          desc="Cadastro de órgãos financiadores e definição de tipos de bolsa."
          icon={<ShieldCheck size={18} />}
        />
        <CardLink
          to="/adm/settings/academic-units"
          title="Unidades Acadêmicas"
          desc="Importação e gerenciamento da árvore institucional (centros e departamentos)."
          icon={<Building2 size={18} />}
        />
        <CardLink
          to="/adm/settings/roles"
          title="Dicionário de Funções"
          desc="Defina os papéis possíveis no sistema (orientador, bolsista, etc.)."
          icon={<BookUser size={18} />}
        />
        <CardLink
          to="/adm/settings/user-types"
          title="Tipos de Usuários"
          desc="Perfis de acesso e permissões no sistema."
          icon={<Users size={18} />}
        />
      </section>
    </div>
  )
}
