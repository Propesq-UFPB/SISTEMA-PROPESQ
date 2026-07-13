// src/landing/About.tsx
import React from "react"
import { Link } from "react-router-dom"
import AnimateIn from "@/components/AnimateIn"
import aboutImg from "@/utils/img/bg_ufpb.jpg"

const About: React.FC = () => {
  return (
    <section
      id="about"
      aria-label="Apresentação"
      className="w-full bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <AnimateIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-stretch">
            {/* TEXTO */}
            <div className="flex flex-col">
              {/* Linha superior */}
              <div className="h-[3px] w-20 bg-blue-900 mb-6" />

              <h2 className="text-2xl md:text-3xl font-semibold text-blue-900">
                Apresentação
              </h2>

              <div className="mt-6 space-y-5 text-slate-600 leading-relaxed text-[15px] md:text-base">
                <p>
                  A Pró-Reitoria de Pesquisa (Propesq) é o órgão auxiliar de direção
                  superior incumbido de propor, planejar, coordenar, controlar, executar
                  e avaliar as políticas de pesquisa científica e tecnológica mantidas
                  pela Universidade (Resolução CONSUNI 01/2017).
                </p>

                <p className="text-slate-700">
                  São órgãos da Pró-Reitoria de Pesquisa:
                </p>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>Coordenação-Geral de Pesquisa (CGPq);</li>
                  <li>
                    Coordenação-Geral de Programas Acadêmicos e de Iniciação Científica
                    (CGPAIC);
                  </li>
                  <li>Divisão de Atividades Orçamentário-Financeiras (DAOF);</li>
                  <li>Gabinete do Pró(a)-Reitor(a).</li>
                </ol>
              </div>

              {/* Divisor animado */}
              <div className="mt-10 relative h-[1px] bg-slate-200 overflow-hidden">
                <span className="absolute left-0 top-0 h-full w-0 bg-blue-900 animate-[growLine_0.8s_ease_forwards]" />
              </div>

              <Link
                to="/quem-somos"
                className="mt-6 group inline-flex items-center gap-3 text-blue-900 font-semibold transition-all duration-300"
              >
                <span className="relative">
                  Quem Somos
                  <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-900 transition-all duration-300 group-hover:w-full" />
                </span>

                <span className="text-2xl leading-none transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </Link>

            </div>

            {/* IMAGEM */}
            <div className="w-full">
              <div className="w-full h-[320px] sm:h-[420px] lg:h-full overflow-hidden">
                <img
                  src={aboutImg}
                  alt="UFPB"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

export default About
