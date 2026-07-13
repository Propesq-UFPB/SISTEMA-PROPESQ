// editais - Não estamos usando

import React from "react"
import AnimateIn from "@/components/AnimateIn"

type ProposalItem = {
  category: string
  title: string
  updatedAt: string
}

// exemplos de editais
const PROPOSALS_DATA: ProposalItem[] = [
  {
    category: "Processo Seletivo",
    title:
      "EDITAL Nº 02/2026 – Chamada Pública Interna para projetos de Iniciação Científica",
    updatedAt: "Atualizado em 11/12/2025",
  },
  {
    category: "Eleição",
    title:
      "EDITAL Nº 03/2026 – Eleições para cargos de coordenação de programas de pós-graduação",
    updatedAt: "Atualizado em 11/12/2025",
  },
  {
    category: "Processo Seletivo",
    title:
      "EDITAL Nº 04/2026 – Processo seletivo para estudantes pesquisadores",
    updatedAt: "Atualizado em 11/12/2025",
  },
  {
    category: "Processo Seletivo",
    title:
      "EDITAL Nº 05/2026 – Processo seletivo para pesquisadores colaboradores",
    updatedAt: "Atualizado em 11/12/2025",
  },
]

const Proposals: React.FC = () => {
  return (
    <section id="proposals" className="w-full bg-neutral-light py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <AnimateIn>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary">
              Editais e Chamadas
            </h2>

            <div className="mt-3 w-20 h-[4px] bg-accent rounded-full" />
            <div className="mt-3 h-px w-full bg-neutral-light" />
          </div>
        </AnimateIn>

        {/* Lista de editais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROPOSALS_DATA.map((item, index) => (
            <AnimateIn key={index} delay={index * 120}>
              <article className="space-y-3">
                <span className="text-sm font-medium text-primary">
                  {item.category}
                </span>

                <p className="text-sm text-neutral leading-relaxed">
                  {item.title}
                </p>

                <span className="text-xs text-neutral">
                  {item.updatedAt}
                </span>
              </article>
            </AnimateIn>
          ))}
        </div>

        {/* Mais editais */}
        <AnimateIn delay={400}>
          <div className="mt-10 flex justify-end">
            <a
              href="/editais"
              className="text-sm font-medium text-primary hover:underline"
            >
              Mais editais →
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

export default Proposals
