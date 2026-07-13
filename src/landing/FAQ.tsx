// src\landing\FAQ.tsx - não estamos usando

import React, { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import AnimateIn from "@/components/AnimateIn"

type FAQItem = {
  question: string
  answer: string
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "O que é o SISTEMA PROPESQ?",
    answer:
      "O PROPESQ é a plataforma institucional da Universidade voltada à gestão integrada das atividades de pesquisa científica e tecnológica. Ela apoia o planejamento, a execução, o acompanhamento e a avaliação de projetos de pesquisa, bolsas, acordos institucionais e fluxos administrativos, promovendo maior organização, transparência e eficiência.",
  },
  {
    question: "Qual é o papel da Pró-Reitoria de Pesquisa (PROPESQ)?",
    answer:
      "A Pró-Reitoria de Pesquisa (PROPESQ) é o órgão auxiliar da direção superior responsável por propor, planejar, coordenar, controlar, executar e avaliar as políticas de pesquisa científica e tecnológica da Universidade, atuando de forma estratégica no fortalecimento da produção científica e da inovação.",
  },
  {
    question: "Quem pode utilizar o sistema?",
    answer:
      "O sistema é destinado a estudantes de graduação e pós-graduação, docentes, pesquisadores, coordenadores de projetos e gestores institucionais. Cada perfil possui permissões específicas, de acordo com suas atribuições acadêmicas e administrativas.",
  },
  {
    question: "Quais tipos de projetos podem ser cadastrados?",
    answer:
      "Podem ser cadastrados projetos de iniciação científica, projetos de pós-graduação, pesquisa aplicada, inovação científica e tecnológica, bem como projetos vinculados a editais, programas institucionais, acordos e parcerias acadêmicas.",
  },
  {
    question: "Quais são os principais benefícios da plataforma PROPESQ?",
    answer:
      "A plataforma PROPESQ atua como um ambiente estratégico para integração acadêmica, acompanhamento contínuo dos projetos, transparência administrativa e fortalecimento das trajetórias acadêmicas, contribuindo para a tomada de decisão baseada em dados e para a inovação científica.",
  },
  {
    question: "Onde posso obter suporte ou esclarecimentos?",
    answer:
      "O suporte é oferecido pela equipe da PROPESQ por meio dos canais institucionais oficiais, além de orientações, comunicados e documentação disponibilizados diretamente na plataforma.",
  },
]


const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabsRef = useRef<HTMLDivElement>(null)

  const scrollTabs = (direction: "left" | "right") => {
    if (!tabsRef.current) return
    tabsRef.current.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    })
  }

  return (
    <section id="faq" className="w-full bg-white py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <AnimateIn>
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl md:text-4xl font-bold text-primary">
              Perguntas frequentes
            </h2>
            <p className="mt-3 text-sm md:text-base text-neutral">
              Informações essenciais sobre o funcionamento do PROPESQ.
            </p>
          </div>
        </AnimateIn>

        {/* ===== FAQ EM FORMATO DE PASTA ===== */}
        <AnimateIn delay={120}>
          <div className="relative">
            {/* Abas */}
            <div className="flex items-end gap-3">
              {/* Seta esquerda */}
              <button
                onClick={() => scrollTabs("left")}
                className="flex items-center justify-center w-8 h-8 text-primary"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Tabs */}
              <div
                ref={tabsRef}
                className="flex gap-2 overflow-hidden flex-1"
              >
                {FAQ_DATA.map((item, index) => {
                  const isActive = index === activeIndex

                  return (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`
                        relative z-10
                        px-5 py-2
                        text-xs md:text-sm font-medium
                        whitespace-nowrap
                        rounded-t-xl
                        border border-neutral-light
                        transition-all
                        ${
                          isActive
                            ? "bg-accent text-primary border-b-0"
                            : "bg-white text-primary hover:bg-accent-medium"
                        }
                      `}
                    >
                      {item.question}
                    </button>
                  )
                })}
              </div>

              {/* Seta direita */}
              <button
                onClick={() => scrollTabs("right")}
                className="flex items-center justify-center w-8 h-8 text-primary"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Conteúdo */}
            <div
              className="
                relative
                bg-accent
                border border-neutral-light
                rounded-b-2xl rounded-tr-2xl
                shadow-card
                -mt-[1px]
              "
            >
              <div
                className="
                  p-6 md:p-10
                  min-h-[260px] md:min-h-[320px]
                  pb-16 md:pb-20
                "
              >
                <AnimateIn key={activeIndex}>
                  <>
                    <h3 className="text-lg md:text-2xl font-semibold text-primary mb-4">
                      {FAQ_DATA[activeIndex].question}
                    </h3>

                    <p className="text-sm md:text-base text-neutral leading-relaxed max-w-4xl">
                      {FAQ_DATA[activeIndex].answer}
                    </p>
                  </>
                </AnimateIn>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}

export default FAQ
