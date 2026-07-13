import React from "react"
import { Link } from "react-router-dom"
import AnimateIn from "@/components/AnimateIn"

type PubItem = {
  title: string
  description: string
  to: string
  updatedAt: string
  tag: string
}

const publications: PubItem[] = [
  {
    title: "Anais de Iniciação Científica",
    description:
      "Publicações oficiais dos eventos de iniciação científica da UFPB, organizadas por edição e ano.",
    to: "/publications/anais",
    updatedAt: "Atualizado em 30/01/2026",
    tag: "Publicações",
  },
  {
    title: "Série Iniciados",
    description:
      "Série editorial que reúne trabalhos selecionados de iniciação científica, com caráter permanente.",
    to: "/publications/iniciados",
    updatedAt: "Atualizado em 30/01/2026",
    tag: "Publicações",
  },
]

const Publications: React.FC = () => {
  return (
    <section id="publications" className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <AnimateIn>
          <div className="mb-8">
            <div className="h-[3px] w-16 bg-blue-800 mb-4" />
            <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">
              Publicações
            </h1>
            <p className="mt-3 text-sm md:text-base text-slate-600 max-w-3xl">
              Repositório institucional das publicações vinculadas à iniciação
              científica da Universidade Federal da Paraíba.
            </p>
          </div>
        </AnimateIn>

        {/* Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {publications.map((item, index) => (
            <AnimateIn key={item.to} delay={index * 120}>
              <Link
                to={item.to}
                className="
                  group block
                  border-t-2 border-slate-200
                  pt-6
                  pb-6
                  focus:outline-none
                "
              >
                {/* faixa superior azul */}
                <div className="h-[2px] w-0 bg-blue-900 transition-all duration-300 group-hover:w-24" />

                {/* Tag 
                <p className="mt-4 text-blue-900 font-semibold text-lg">
                  {item.tag}
                </p>*/}

                {/* Título */}
                <h2 className="mt-2 text-sm md:text-base font-semibold text-slate-900 leading-snug">
                  <span className="relative inline-block">
                    {item.title}
                    <span className="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-full bg-blue-900 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  </span>
                </h2>

                {/* Descrição curta */}
                <p className="mt-3 text-sm text-slate-700 leading-relaxed max-w-[52ch]">
                  {item.description}
                </p>

                {/* Atualização */}
                <p className="mt-10 text-sm text-slate-500">{item.updatedAt}</p>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Publications
