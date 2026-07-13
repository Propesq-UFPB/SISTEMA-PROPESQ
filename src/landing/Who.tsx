import React from "react"
import AnimateIn from "@/components/AnimateIn"
import bgHero from "@/utils/img/bg1.png"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

type Contact = {
  name: string
  phone: string
  email: string
}

const CONTACTS: Contact[] = [
  {
    name: "CGPAIC (Informações Gerais)",
    phone: "3216-7570",
    email: "cgpaic@propesq.ufpb.br",
  },
  {
    name: "CGPq",
    phone: "3216-7551",
    email: "pesquisa@propesq.ufpb.br",
  },
  {
    name: "SECRETARIA",
    phone: "3216-7553",
    email: "secretaria@propesq.ufpb.br",
  },
  {
    name: "Assuntos referentes à BOLSAS",
    phone: "3216-7570",
    email: "cadastrocgpaic@propesq.ufpb.br",
  },
  {
    name: "Assuntos referentes à Bolsas FAPESQ",
    phone: "3216-7570",
    email: "cgpaicfapesq@gmail.com",
  },
  {
    name: "Assuntos referentes ao SIGAA",
    phone: "3216-7570",
    email: "portal@propesq.ufpb.br",
  },
  {
    name: "Coordenação Geral - CGPAIC",
    phone: "3216-7570",
    email: "coordenacaocic@propesq.ufpb.br",
  },
  {
    name: "Divisão Orçamentária e Financeira - DAOF",
    phone: "3216-7551",
    email: "daof@propesq.ufpb.br",
  },
]

const Who: React.FC = () => {
  const navigate = useNavigate()
  return (
    <main className="w-full">
      {/* HERO  */}
      <div
        className="w-full h-[280px] md:h-[340px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgHero})` }}
        aria-hidden="true"
      />

      {/* CONTEÚDO SOBREPOSTO */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-24 relative z-10">
        <div className="bg-white border border-slate-200 shadow-sm">
          <div className="px-6 md:px-10 py-8 md:py-10">
            <AnimateIn>
              {/* Cabeçalho */}
              <div className="mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-black hover:underline underline-offset-4">
                    <ArrowLeft size={16} />
                        Voltar
                </button>
                <div className="h-[3px] w-16 bg-blue-900 mb-4" />
                <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">
                  Quem Somos
                </h1>
                <div className="mt-4 border-t border-slate-200" />
              </div>
            </AnimateIn>

            {/* Apresentação */}
            <section aria-label="Apresentação" className="mb-10">
              <AnimateIn>
                <p className="text-slate-700 leading-relaxed text-[15px] md:text-base">
                  A Pró-Reitoria de Pesquisa (Propesq) é o órgão auxiliar de direção
                  superior incumbido de propor, planejar, coordenar, controlar, executar
                  e avaliar as políticas de pesquisa científica e tecnológica mantidas
                  pela Universidade.
                </p>
              </AnimateIn>
            </section>

            {/* Contatos */}
            <section aria-label="Equipe e Contatos">
              <AnimateIn>

                <div className="border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 bg-white text-center font-semibold text-slate-900">
                    Contatos Gerais
                  </div>

                  {/* Tabela */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-200/80 text-slate-700">
                          <th className="text-left font-semibold text-sm px-4 py-3 border-t border-slate-200">
                            Nome
                          </th>
                          <th className="text-left font-semibold text-sm px-4 py-3 border-t border-slate-200">
                            Telefone
                          </th>
                          <th className="text-left font-semibold text-sm px-4 py-3 border-t border-slate-200">
                            Email
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {CONTACTS.map((c, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-slate-200 hover:bg-slate-50"
                          >
                            <td className="px-4 py-3 text-slate-800 text-sm md:text-[15px]">
                              {c.name}
                            </td>
                            <td className="px-4 py-3 text-slate-800 text-sm md:text-[15px] whitespace-nowrap">
                              {c.phone}
                            </td>
                            <td className="px-4 py-3 text-sm md:text-[15px]">
                              <a
                                href={`mailto:${c.email}`}
                                className="text-blue-900 hover:underline underline-offset-4"
                              >
                                {c.email}
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AnimateIn>
            </section>
          </div>
        </div>
      </div>

      <div className="h-14" />
    </main>
  )
}

export default Who
